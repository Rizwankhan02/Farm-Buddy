package com.marketplace.pojos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Integer userId;

	@Column(unique = true, length = 50)
	private String email;

	@Column(length = 30)
	private String password;

	@Column(name = "phone_no", length = 15)
	private String phoneNo;

	@Column(name = "Address", length = 200)
	private String address;

	@Column(length = 20)
	private String firstname;

	@Column(length = 20)
	private String lastname;

	@Column(name = "is_admin")
	private boolean isadmin;

	@Column(name = "user_type", length = 10)
	private String userType; // "BUYER" or "SELLER"

	@OneToMany(mappedBy = "user")
	@JsonIgnore
	private List<Orders> orders;

//	@Transient
//	private List<CartItem> cart;

	public User() {
		System.out.println("User Constructor invoked");
	}

	public User(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}

	public User(String email, String password, String phoneNo, String address, String firstname, String lastname,
			boolean isadmin) {
		super();
		this.email = email;
		this.password = password;
		this.phoneNo = phoneNo;
		this.address = address;
		this.firstname = firstname;
		this.lastname = lastname;
		this.isadmin = isadmin;
	}
	
	

	public User(Integer userId, String email, String password, String phoneNo, String address, String firstname,
			String lastname, boolean isadmin) {
		super();
		this.userId = userId;
		this.email = email;
		this.password = password;
		this.phoneNo = phoneNo;
		this.address = address;
		this.firstname = firstname;
		this.lastname = lastname;
		this.isadmin = isadmin;
	}
	
	public User(Integer userId, String email, String password, String phoneNo, String address, String firstname,
			String lastname) {
		super();
		this.userId = userId;
		this.email = email;
		this.password = password;
		this.phoneNo = phoneNo;
		this.address = address;
		this.firstname = firstname;
		this.lastname = lastname;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer aUserId) {
		userId = aUserId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String aEmail) {
		email = aEmail;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String aPassword) {
		password = aPassword;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String aPhoneNo) {
		phoneNo = aPhoneNo;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String aAddress) {
		address = aAddress;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String aFirstname) {
		firstname = aFirstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String aLastname) {
		lastname = aLastname;
	}

	public boolean isIsadmin() {
		return isadmin;
	}

	public void setIsadmin(boolean isadmin) {
		this.isadmin = isadmin;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public List<Orders> getOrders() {
		return orders;
	}

	public void setOrders(List<Orders> aOrders) {
		orders = aOrders;
	}

	@Override
	public String toString() {
		return "User [userId=" + userId + ", email=" + email + ", password=" + password + ", phoneNo=" + phoneNo
				+ ", address=" + address + ", firstname=" + firstname + ", lastname=" + lastname + ", orders=" + orders
				+ "]";
	}

}
