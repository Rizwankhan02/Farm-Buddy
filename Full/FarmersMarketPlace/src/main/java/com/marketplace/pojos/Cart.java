package com.marketplace.pojos;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "cart")
public class Cart {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cart_id")
	private Integer cartId;
	
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "cart_id")
	private List<CartItem> items;
	
	@Column(name = "GrandTotal", nullable = false)
	private double GrandTotal;
	
	public Integer getCartId() {
		return cartId;
	}
	
	public void setCartId(Integer cartId) {
		this.cartId = cartId;
	}
	
	public List<CartItem> getItems() {
		return items;
	}
	
	public void setItems(List<CartItem> items) {
		this.items = items;
	}
	
	public double getGrandTotal() {
		return GrandTotal;
	}
	
	public void setGrandTotal(double grandTotal) {
		GrandTotal = grandTotal;
	}
	
	public double calculateTotal(List<CartItem> items) {
		for(CartItem item : items) {
			GrandTotal+=item.getAmount();
		}
		return GrandTotal;
	}
	
}
