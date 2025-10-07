package com.marketplace.dao;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.marketplace.pojos.Cart;
import com.marketplace.pojos.CartItem;
import com.marketplace.pojos.Farmer;
import com.marketplace.pojos.OrderDetails;
import com.marketplace.pojos.Orders;
import com.marketplace.pojos.StockDetails;
import com.marketplace.pojos.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;


@Repository
public class UserDaoImpl implements IUserDao {

	@PersistenceContext
	private EntityManager mgr;

	@Override
	public boolean RegisterUser(User user) {
		try {
			// Check if user with email already exists
			String checkJpql = "SELECT COUNT(u) FROM User u WHERE email=:em";
			Long count = mgr.createQuery(checkJpql, Long.class)
					.setParameter("em", user.getEmail())
					.getSingleResult();
			
			if (count > 0) {
				throw new RuntimeException("Email already exists: " + user.getEmail());
			}
			
			// Set default admin status if not set
			if (user.getEmail() != null && user.getEmail().equals("admin@admin.com")) {
				user.setIsadmin(true);
			} else {
				user.setIsadmin(false);
			}
			
			// Set default userType if not provided
			if (user.getUserType() == null || user.getUserType().isEmpty()) {
				user.setUserType("BUYER"); // Default to BUYER
			}
			
			mgr.persist(user);
			mgr.flush(); // Force the persistence to happen immediately
			
			// If user is a SELLER, also create a Farmer entry
			if ("SELLER".equals(user.getUserType())) {
				Farmer farmer = new Farmer();
				farmer.setFirstname(user.getFirstname());
				farmer.setLastname(user.getLastname());
				farmer.setEmail(user.getEmail());
				farmer.setPhoneNo(user.getPhoneNo());
				farmer.setAddress(user.getAddress());
				mgr.persist(farmer);
				mgr.flush();
				System.out.println("Farmer entry created for seller: " + user.getEmail());
			}
			
			System.out.println("User registered successfully: " + user.getEmail() + " as " + user.getUserType());
			return true;
		} catch (Exception e) {
			System.err.println("DAO Registration error: " + e.getMessage());
			throw e;
		}
	}

	@Override
	public User AuthenticateUser(String email, String password) {
		String jpql = "SELECT u FROM User u WHERE email=:em and password=:pass";
		User user = mgr.createQuery(jpql, User.class).setParameter("em", email)
				.setParameter("pass", password).getSingleResult();
		if (user != null)
			return user;
		return null;
	}

	@Override
	public CartItem AddToCart(int productid, int qty) {
		String jpql = "SELECT NEW com.marketplace.pojos.StockDetails(sd.id, sd.stockItem, sd.pricePerUnit) FROM StockDetails sd WHERE sd.id=:Id";
		String jpql2 = "SELECT sd.farmer1 FROM StockDetails sd JOIN sd.farmer1 f WHERE sd.id=:pid";
		StockDetails product = mgr.createQuery(jpql, StockDetails.class)
				.setParameter("Id", productid).getSingleResult();
		Farmer fid = mgr.createQuery(jpql2, Farmer.class).setParameter("pid", productid)
				.getSingleResult();

		CartItem item = new CartItem();
		item.setId(product.getId());
		item.setItem(product.getStockItem());
		item.setPrice(product.getPricePerUnit());
		item.setQty(qty);
		item.setAmount(qty * product.getPricePerUnit());
		item.setFarmer_id(fid.getFarmerId());

		return item;
	}

	@Override
	public boolean PlaceOrder(Cart cart, User user) {
		Orders order = new Orders();
		List<CartItem> items = cart.getItems();

		for (CartItem item : items) {
			OrderDetails details = new OrderDetails();
			details.setAmount(item.getAmount());
			details.setOrderItem(item.getItem());
			details.setQuantity(item.getQty());
			Farmer f = mgr.find(Farmer.class, item.getFarmer_id());
			details.setFarmer(f);
			order.getOrderDetails().add(details);
		}
		
		order.setDeliveryStatus(false);
		order.setPaymentStatus(true);
		order.setUser(user);
		
		long millis=System.currentTimeMillis();  
		order.setPlaceOrderDate(new java.sql.Date(millis));
		
		java.sql.Date todaysDate = new java.sql.Date(new java.util.Date().getTime());
		int futureDay =3;
		java.sql.Date futureDate = this.addDays(todaysDate, futureDay);
		order.setDeliveryDate(futureDate);
		
		mgr.persist(order);
		for(OrderDetails det : order.getOrderDetails()) {
			det.setOrders(order);
			mgr.persist(det);
		}
		return true;
	}
	
	 public Date addDays(Date date, int days) {
	        Calendar c = Calendar.getInstance();
	        c.setTime(date);
	        c.add(Calendar.DATE, days);
	        return new Date(c.getTimeInMillis());
	    }
	 
	 @Override
	 public User getUserDetails(int userId) {
		 String jpql = "SELECT NEW com.marketplace.pojos.User(u.userId, u.firstname, u.lastname, u.email, u.phoneNo, u.address, u.password) FROM User u WHERE u.userId=:userId";
			return mgr.createQuery(jpql, User.class).setParameter("userId", userId).getSingleResult();
		}
	 
	 @Override
		public List<OrderDetails> getOrder(int userId) {
			 String jpql = "SELECT NEW com.marketplace.pojos.OrderDetails(o.id, o.orderItem, o.quantity, o.amount, o.orders) FROM OrderDetails o "
			 		+ "JOIN o.orders ord JOIN ord.user u WHERE u.userId =:userid";
			 return mgr.createQuery(jpql, OrderDetails.class).setParameter("userid", userId).getResultList();
		}

}
