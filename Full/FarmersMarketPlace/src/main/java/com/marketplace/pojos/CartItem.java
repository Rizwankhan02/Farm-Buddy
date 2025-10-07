package com.marketplace.pojos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "cart_items")
public class CartItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private int id;
	
	@Column(name = "cart_item", nullable = false, length = 50, unique = true)
	private String item;
	
	@Column(name = "cart_qty", nullable = false, length = 50, unique = true)
	private int qty;
	
	@Column(name = "Price", nullable = false, unique = true)
	@Size(min=1)
	private double price;
	
	@Column(name = "Amount", nullable = false)
	private double amount;
	
	@Column(name = "farmerid", nullable = false)
	private int farmer_id;
	
	@Column(name = "cart_id")
	private Integer cartId;

	public CartItem() {
		System.out.println("Cart Constructor invoked");
	}

	public CartItem(int id, String item, int qty, double price, double amount, int farmer_id) {
		this.id = id;
		this.item = item;
		this.qty = qty;
		this.price = price;
		this.amount = amount;
		this.farmer_id = farmer_id;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getItem() {
		return item;
	}

	public void setItem(String item) {
		this.item = item;
	}

	public int getQty() {
		return qty;
	}

	public void setQty(int qty) {
		this.qty = qty;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public int getFarmer_id() {
		return farmer_id;
	}

	public void setFarmer_id(int farmer_id) {
		this.farmer_id = farmer_id;
	}

	@Override
	public String toString() {
		return "CartItem [id=" + id + ", item=" + item + ", qty=" + qty + ", price=" + price + ", amount=" + amount
				+ "]";
	}

}
