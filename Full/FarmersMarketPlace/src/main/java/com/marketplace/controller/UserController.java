package com.marketplace.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.DocumentException;
import com.marketplace.pojos.Authentication;
import com.marketplace.pojos.Cart;
import com.marketplace.pojos.CartItem;
import com.marketplace.pojos.OrderDetails;
import com.marketplace.pojos.User;
import com.marketplace.service.IUserService;
import com.marketplace.service.PdfExportService;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private IUserService u_service;
	
	@Autowired
	private PdfExportService pdfService;

	List<CartItem> items = null;
	Cart mycart = new Cart();
	User user = new User();

	@PostMapping("/register")
	public ResponseEntity<?> RegisterNewUser(@RequestBody User user) {
		try {
			boolean success = u_service.Register(user);
			if (success) {
				return new ResponseEntity<String>("Registration Successful..!!", HttpStatus.CREATED);
			} else {
				return new ResponseEntity<String>("Registration failed. Please try again.", HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			System.err.println("Registration error: " + e.getMessage());
			e.printStackTrace();
			if (e.getMessage().contains("Duplicate entry") || e.getMessage().contains("unique constraint")) {
				return new ResponseEntity<String>("Email already exists. Please use a different email.", HttpStatus.CONFLICT);
			}
			return new ResponseEntity<String>("Registration failed. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> LoginUser(@RequestBody Authentication userID) {
		String email = userID.getEmail();
		String password = userID.getPassword();
		System.out.println(email + "   " + password);
		User u = null;
		try {
			u = u_service.Authenticate(email, password);
		} catch (Exception e) {
			return new ResponseEntity<Void>(HttpStatus.OK);
		}

		user = u;

		items = new ArrayList<CartItem>();
		return new ResponseEntity<User>(u, HttpStatus.OK);

	}

	@PostMapping("/addtocart/{productid}")
	public ResponseEntity<?> AddToCart(@PathVariable int productid, @RequestParam int qty) {
		System.out.println("in AddToCart");
		CartItem product = u_service.AddToCart(productid, qty);
		items.add(product);
		System.out.println("item added to cart");
		System.out.println(items);
		return new ResponseEntity<List<CartItem>>(items, HttpStatus.OK);
	}

	@GetMapping("/checkout")
	public ResponseEntity<?> CheckOut() {
		System.out.println("checkout");
		double grandtotal = 0.0;

		for (CartItem item : items) {
			grandtotal += item.getAmount();
		}
		mycart.setItems(items);
		mycart.setGrandTotal(grandtotal);
		return new ResponseEntity<List<CartItem>>(items, HttpStatus.OK);
	}

	@PostMapping("/removefromcart/{productid}") // "productid" here is index of list
	public ResponseEntity<?> removeItem(@PathVariable int productid) {
		System.out.println("Removing item");
		items.remove(productid);
		return new ResponseEntity<List<CartItem>>(items, HttpStatus.OK);
	}

	@PostMapping("/placeorder")
	public ResponseEntity<?> PlaceOrder()
			throws DocumentException, MalformedURLException, URISyntaxException, IOException {

		u_service.PlaceOrder(mycart, user);

		pdfService.export(items);

		// Email verification removed - order placed successfully
		System.out.println("Order placed successfully for user: " + user.getEmail());

		items.clear();
		return new ResponseEntity<List<CartItem>>(items, HttpStatus.OK);
	}

	@PostMapping("/orders") // "productid" here is index of list
	public ResponseEntity<?> Orders(@RequestParam int userId) {
		System.out.println("inside orders" + userId);
		List<OrderDetails> orders = u_service.getOrder(userId);
		return new ResponseEntity<List<OrderDetails>>(orders, HttpStatus.OK);
	}
	
	@GetMapping("/getorders")
	public ResponseEntity<?> getOrders() {
		System.out.println("in getOrders");
		// For now, return empty list. In a real app, you'd get orders for current user
		List<OrderDetails> orders = new ArrayList<>();
		return new ResponseEntity<List<OrderDetails>>(orders, HttpStatus.OK);
	}
}
