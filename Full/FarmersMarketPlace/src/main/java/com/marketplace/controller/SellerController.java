package com.marketplace.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.pojos.Category;
import com.marketplace.pojos.Farmer;
import com.marketplace.pojos.StockDetails;
import com.marketplace.service.IAdminService;
import com.marketplace.service.IFarmersService;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/seller")
public class SellerController {

	@Autowired
	private IFarmersService f_service;

	@Autowired
	private IAdminService a_service;

	// Get seller's profile by email
	@GetMapping("/profile/{email}")
	public ResponseEntity<?> getSellerProfile(@PathVariable String email) {
		try {
			Farmer farmer = f_service.getFarmerByEmail(email);
			if (farmer != null) {
				return new ResponseEntity<Farmer>(farmer, HttpStatus.OK);
			} else {
				return new ResponseEntity<String>("Seller profile not found", HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<String>("Error fetching seller profile", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Get all categories for dropdown
	@GetMapping("/categories")
	public ResponseEntity<?> getAllCategories() {
		try {
			List<Category> categories = a_service.getAllCategory();
			return new ResponseEntity<List<Category>>(categories, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>("Error fetching categories", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Get seller's products by farmer ID
	@GetMapping("/products/{farmerId}")
	public ResponseEntity<?> getSellerProducts(@PathVariable int farmerId) {
		try {
			List<StockDetails> products = f_service.getFarmerStock(farmerId);
			return new ResponseEntity<List<StockDetails>>(products, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>("Error fetching products", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Add new product for seller
	@PostMapping("/products/{farmerId}")
	public ResponseEntity<?> addProduct(@PathVariable int farmerId, @RequestBody StockDetails product) {
		try {
			// Set the farmer for this product
			Farmer farmer = f_service.getFarmerDetails(farmerId);
			if (farmer != null) {
				product.setFarmer(farmer);
				
				// Handle category - if category has only categoryName, find or create it
				if (product.getCategory() != null && product.getCategory().getCategoryName() != null) {
					Category existingCategory = a_service.getCategoryByName(product.getCategory().getCategoryName());
					if (existingCategory != null) {
						// Use existing category
						product.setCategory(existingCategory);
					} else {
						// Create new category
						Category newCategory = new Category();
						newCategory.setCategoryName(product.getCategory().getCategoryName());
						Category savedCategory = a_service.addCategory(newCategory);
						product.setCategory(savedCategory);
					}
				}
				
				boolean success = f_service.addProduct(product);
				if (success) {
					return new ResponseEntity<String>("Product added successfully", HttpStatus.CREATED);
				} else {
					return new ResponseEntity<String>("Failed to add product", HttpStatus.BAD_REQUEST);
				}
			} else {
				return new ResponseEntity<String>("Seller not found", HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>("Error adding product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Update product
	@PutMapping("/products/{productId}")
	public ResponseEntity<?> updateProduct(@PathVariable int productId, @RequestBody StockDetails updatedProduct) {
		try {
			boolean success = f_service.updateProduct(productId, updatedProduct);
			if (success) {
				return new ResponseEntity<String>("Product updated successfully", HttpStatus.OK);
			} else {
				return new ResponseEntity<String>("Failed to update product", HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<String>("Error updating product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Delete product
	@DeleteMapping("/products/{productId}")
	public ResponseEntity<?> deleteProduct(@PathVariable int productId) {
		try {
			boolean success = f_service.deleteProduct(productId);
			if (success) {
				return new ResponseEntity<String>("Product deleted successfully", HttpStatus.OK);
			} else {
				return new ResponseEntity<String>("Failed to delete product", HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<String>("Error deleting product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Get specific product details
	@GetMapping("/products/{farmerId}/{productId}")
	public ResponseEntity<?> getProductDetails(@PathVariable int farmerId, @PathVariable int productId) {
		try {
			StockDetails product = f_service.getProductDetails(farmerId, productId);
			if (product != null) {
				return new ResponseEntity<StockDetails>(product, HttpStatus.OK);
			} else {
				return new ResponseEntity<String>("Product not found", HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<String>("Error fetching product details", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Get seller's sales/orders
	@GetMapping("/sales/{farmerId}")
	public ResponseEntity<?> getSellerSales(@PathVariable int farmerId) {
		try {
			List<?> sales = f_service.getSellerSales(farmerId);
			return new ResponseEntity<List<?>>(sales, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>("Error fetching sales data", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Get sales statistics
	@GetMapping("/stats/{farmerId}")
	public ResponseEntity<?> getSellerStats(@PathVariable int farmerId) {
		try {
			Object stats = f_service.getSellerStats(farmerId);
			return new ResponseEntity<Object>(stats, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>("Error fetching statistics", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Update seller profile
	@PutMapping("/profile/{farmerId}")
	public ResponseEntity<?> updateSellerProfile(@PathVariable int farmerId, @RequestBody Farmer updatedProfile) {
		try {
			boolean success = f_service.updateSellerProfile(farmerId, updatedProfile);
			if (success) {
				return new ResponseEntity<String>("Profile updated successfully", HttpStatus.OK);
			} else {
				return new ResponseEntity<String>("Failed to update profile", HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<String>("Error updating profile: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
