"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceXContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let TraceXContract = class TraceXContract extends fabric_contract_api_1.Contract {
    async RegisterProduct(ctx, productId, productType, name, origin) {
        const existingProduct = await ctx.stub.getState(productId);
        if (existingProduct && existingProduct.length > 0) {
            throw new Error(`Product ${productId} already exists`);
        }
        const product = {
            productId,
            productType,
            name,
            origin,
            currentCustodian: 'MANUFACTURER',
            status: 'REGISTERED',
            createdAt: new Date().toISOString()
        };
        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(product)));
    }
    async GetProduct(ctx, productId) {
        const data = await ctx.stub.getState(productId);
        if (!data || data.length === 0) {
            throw new Error(`Product ${productId} does not exist`);
        }
        return data.toString();
    }
};
exports.TraceXContract = TraceXContract;
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TraceXContract.prototype, "RegisterProduct", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], TraceXContract.prototype, "GetProduct", null);
exports.TraceXContract = TraceXContract = __decorate([
    (0, fabric_contract_api_1.Info)({
        title: 'TraceX Contract',
        description: 'Supply chain traceability and verification smart contract'
    })
], TraceXContract);
