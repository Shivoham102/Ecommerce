const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controller/productController");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/add").post(createProduct);
router.route("/products/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);

module.exports = router