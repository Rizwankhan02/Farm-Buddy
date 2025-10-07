package com.marketplace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.marketplace.dao.IUserDao;
import com.marketplace.pojos.Cart;
import com.marketplace.pojos.CartItem;
import com.marketplace.pojos.OrderDetails;
import com.marketplace.pojos.User;

@Service
@Transactional
public class UserServiceImpl implements IUserService {

	@Autowired
	private IUserDao u_dao;

	@Override
	public boolean Register(User user) {
		try {
			return u_dao.RegisterUser(user);
		} catch (Exception e) {
			System.err.println("Service Registration error: " + e.getMessage());
			throw e; // Re-throw to let controller handle it
		}
	}

	@Override
	public User Authenticate(String email, String password) {
		User user = u_dao.AuthenticateUser(email, password);
		return user;
	}

	@Override
	public CartItem AddToCart(int productid, int qty) {
		return u_dao.AddToCart(productid, qty);
	}

	@Override
	public boolean PlaceOrder(Cart cart, User user) {
		return u_dao.PlaceOrder(cart, user);
	}

	@Override
	public User getUserDetails(int userId) {
		// TODO Auto-generated method stub
		return u_dao.getUserDetails(userId);
	}

	@Override
	public List<OrderDetails> getOrder(int userId) {
		return u_dao.getOrder(userId);
	}
}
