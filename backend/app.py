from flask import Flask, request, jsonify
from flask_cors import CORS

from supabase_client import supabase

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "TraceX Backend is running"
    })


@app.route("/api/test-supabase", methods=["GET"])
def test_supabase():

    response = (
        supabase
        .table("participants")
        .select("*")
        .limit(10)
        .execute()
    )

    return jsonify({
        "success": True,
        "data": response.data
    })


# ============================================================
# REGISTER PRODUCT
# ============================================================

@app.route("/api/products", methods=["POST"])
def register_product():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "error": "Request body is required"
        }), 400

    product_id = data.get("productId")
    name = data.get("name")
    category = data.get("category")
    origin = data.get("origin")

    if not product_id:
        return jsonify({
            "success": False,
            "error": "productId is required"
        }), 400

    if not name:
        return jsonify({
            "success": False,
            "error": "name is required"
        }), 400

    # Check if product already exists
    existing = (
        supabase
        .table("products")
        .select("*")
        .eq("product_id", product_id)
        .execute()
    )

    if existing.data:
        return jsonify({
            "success": False,
            "error": "Product ID already exists"
        }), 409

    product = {
        "product_id": product_id,
        "product_name": name,
        "category": category,
        "origin": origin,
        "status": "REGISTERED"
    }

    response = (
        supabase
        .table("products")
        .insert(product)
        .execute()
    )

    return jsonify({
        "success": True,
        "message": "Product registered successfully",
        "product": response.data[0]
    }), 201


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )