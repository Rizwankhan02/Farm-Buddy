package com.marketplace.pojos;

import jakarta.persistence.Column;

public class Authentication {
	
	@Column(name="Email")
	private String email;
	
	@Column(name="Password")
	private String password;
	
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	@Override
	public String toString() {
		return "Authentication [email=" + email + ", password=" + password + "]";
	}
	
}
