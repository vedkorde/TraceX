# TraceX Frontend

A polished React + Vite MVP frontend for the TraceX decentralized supply-chain traceability and verification platform.

## MVP flow

Register → Transfer → Receive → Verify → Track

## Screens

- Role selection: Manufacturer / Distributor / Logistics / Retailer
- Dashboard
- Register Product
- Transfer / Receive
- Verify Product + QR
- Full custody history

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Backend-ready API boundary

The UI currently uses local browser state so the frontend works before Flask/Fabric are connected.

When the backend is ready, create `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_API=false
```

The frontend API contract is designed around:

- POST `/api/products`
- POST `/api/products/{id}/transfer`
- POST `/api/products/{id}/receive`
- GET `/api/products/{id}`
- GET `/api/products/{id}/history`
- GET `/api/products/{id}/verify`

The React layer does not implement Fabric business rules. Those belong behind the Flask → Fabric Gateway → Chaincode architecture.

## Notes

- Demo state is stored in `localStorage`.
- Reset demo data from the sidebar to return to the initial TX-10482 flow.
- QR codes point to `/verify/{productId}`.
