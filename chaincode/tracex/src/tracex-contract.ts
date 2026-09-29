import {
    Context,
    Contract,
    Info,
    Transaction,
    Returns
} from 'fabric-contract-api';

import { Product } from './product';
import { SupplyChainEvent } from './event';

@Info({
    title: 'TraceX Contract',
    description: 'Supply chain traceability and verification smart contract'
})
export class TraceXContract extends Contract {
@Transaction()
public async RegisterProduct(
    ctx: Context,
    productId: string,
    productType: string,
    name: string,
    origin: string
): Promise<void> {

    const existingProduct = await ctx.stub.getState(productId);

    if (existingProduct && existingProduct.length > 0) {
        throw new Error(`Product ${productId} already exists`);
    }

    const product: Product = {
        productId,
        productType,
        name,
        origin,
        currentCustodian: 'MANUFACTURER',
        status: 'REGISTERED',
        createdAt: ctx.stub.getTxTimestamp().seconds.toString()
    };

    await ctx.stub.putState(
        productId,
        Buffer.from(JSON.stringify(product))
    );
}
@Transaction(false)
@Returns('string')
public async GetProduct(
    ctx: Context,
    productId: string
): Promise<string> {

    const data = await ctx.stub.getState(productId);

    if (!data || data.length === 0) {
        throw new Error(`Product ${productId} does not exist`);
    }

    return data.toString();
}
@Transaction(false)
@Returns('string')
public async VerifyProduct(
    ctx: Context,
    productId: string
): Promise<string> {

    const productBytes = await ctx.stub.getState(productId);

    if (!productBytes || productBytes.length === 0) {
        return JSON.stringify({
            valid: false,
            message: `Product ${productId} does not exist`
        });
    }

    const product: Product = JSON.parse(productBytes.toString());

    return JSON.stringify({
        valid: true,
        productId: product.productId,
        productType: product.productType,
        name: product.name,
        origin: product.origin,
        currentCustodian: product.currentCustodian,
        status: product.status,
        createdAt: product.createdAt
    });
}
@Transaction()
public async TransferProduct(
    ctx: Context,
    productId: string,
    to: string,
    location: string
): Promise<void> {

    const productBytes = await ctx.stub.getState(productId);

    if (!productBytes || productBytes.length === 0) {
        throw new Error(`Product ${productId} does not exist`);
    }

    const product: Product = JSON.parse(productBytes.toString());

    const mspId = ctx.clientIdentity.getMSPID();

    let senderRole: string;

    if (mspId === 'Org1MSP') {
        senderRole = 'MANUFACTURER';
    } else if (mspId === 'Org2MSP') {
        senderRole = 'DISTRIBUTOR';
    } else {
        throw new Error(`Unauthorized organization: ${mspId}`);
    }

    if (product.currentCustodian !== senderRole) {
        throw new Error(
            `Unauthorized transfer. Current custodian is ${product.currentCustodian}`
        );
    }

    const allowedRecipients = [
        'DISTRIBUTOR',
        'LOGISTICS',
        'RETAILER'
    ];

    if (!allowedRecipients.includes(to)) {
        throw new Error(`Invalid recipient: ${to}`);
    }

    if (to === senderRole) {
        throw new Error(`Product is already with ${to}`);
    }

    const timestamp = ctx.stub.getTxTimestamp().seconds.toString();
    const eventId = `EVT-${ctx.stub.getTxID()}`;

    const event: SupplyChainEvent = {
        eventId,
        productId,
        eventType: 'TRANSFER',
        from: senderRole,
        to,
        location,
        timestamp,
        actor: mspId
    };

    const eventKey = ctx.stub.createCompositeKey(
        'EVENT',
        [productId, eventId]
    );

    await ctx.stub.putState(
        eventKey,
        Buffer.from(JSON.stringify(event))
    );

    product.currentCustodian = to;
    product.status = 'IN_TRANSIT';

    await ctx.stub.putState(
        productId,
        Buffer.from(JSON.stringify(product))
    );
}
@Transaction()
public async ReceiveProduct(
    ctx: Context,
    productId: string,
    location: string
): Promise<void> {

    const productBytes = await ctx.stub.getState(productId);

    if (!productBytes || productBytes.length === 0) {
        throw new Error(`Product ${productId} does not exist`);
    }

    const product: Product = JSON.parse(productBytes.toString());

    const mspId = ctx.clientIdentity.getMSPID();

    let receiverRole: string;

    if (mspId === 'Org1MSP') {
        receiverRole = 'MANUFACTURER';
    } else if (mspId === 'Org2MSP') {
        receiverRole = 'DISTRIBUTOR';
    } else {
        throw new Error(`Unauthorized organization: ${mspId}`);
    }

    if (product.currentCustodian !== receiverRole) {
        throw new Error(
            `Unauthorized receive. Product is assigned to ${product.currentCustodian}`
        );
    }

    if (product.status !== 'IN_TRANSIT') {
        throw new Error(
            `Product ${productId} is not currently in transit`
        );
    }

    const timestamp = ctx.stub.getTxTimestamp().seconds.toString();
    const eventId = `EVT-${ctx.stub.getTxID()}`;

    const event: SupplyChainEvent = {
        eventId,
        productId,
        eventType: 'RECEIVE',
        from: receiverRole,
        to: receiverRole,
        location,
        timestamp,
        actor: mspId
    };

    const eventKey = ctx.stub.createCompositeKey(
        'EVENT',
        [productId, eventId]
    );

    await ctx.stub.putState(
        eventKey,
        Buffer.from(JSON.stringify(event))
    );

    product.status = 'RECEIVED';

    await ctx.stub.putState(
        productId,
        Buffer.from(JSON.stringify(product))
    );
}
@Transaction(false)
@Returns('string')
public async GetProductHistory(
    ctx: Context,
    productId: string
): Promise<string> {

    const productBytes = await ctx.stub.getState(productId);

    if (!productBytes || productBytes.length === 0) {
        throw new Error(`Product ${productId} does not exist`);
    }

    const iterator = await ctx.stub.getStateByPartialCompositeKey(
        'EVENT',
        [productId]
    );

    const events: SupplyChainEvent[] = [];

    let result = await iterator.next();

    while (!result.done) {

        if (result.value && result.value.value) {
            const event = JSON.parse(
                result.value.value.toString()
            );

            events.push(event);
        }

        result = await iterator.next();
    }

    await iterator.close();

    return JSON.stringify(events);
}
}