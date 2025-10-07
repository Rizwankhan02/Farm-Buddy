package com.marketplace.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.marketplace.pojos.Farmer;
import com.marketplace.pojos.SellerStats;
import com.marketplace.pojos.StockDetails;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;


@Repository
public class FarmersDaoImpl implements IFarmersDao {

	@PersistenceContext
	private EntityManager mgr;
	
	@Override
	public List<Farmer> getAllFarmers() {
		String jpql = "SELECT NEW com.marketplace.pojos.Farmer(f.farmerId, f.firstname, f.lastname, f.email, f.phoneNo, f.address) FROM Farmer f";
		return mgr.createQuery(jpql, Farmer.class).getResultList();
	}

	@Override
	public List<StockDetails> getFarmerStock(int farmerid) {
		String jpql = "SELECT sd FROM StockDetails sd JOIN sd.farmer1 f WHERE f.farmerId=:frmr ORDER BY sd.id DESC";
		return mgr.createQuery(jpql, StockDetails.class).setParameter("frmr", farmerid).getResultList();
	}

	@Override
	public StockDetails getProductDetails(int farmerid, int productid) {
		String jpql = "SELECT NEW com.marketplace.pojos.StockDetails(sd.id, sd.stockItem, sd.quantity, sd.pricePerUnit, sd.category) FROM StockDetails sd JOIN sd.farmer1 f WHERE f.farmerId=:frmr AND sd.id=:prdct";
		return mgr.createQuery(jpql, StockDetails.class).setParameter("frmr", farmerid).setParameter("prdct", productid).getSingleResult();
	}

	@Override
	public Farmer getFarmerDetails(int id) {
		String jpql = "SELECT NEW com.marketplace.pojos.Farmer(f.farmerId, f.firstname, f.lastname, f.email, f.phoneNo, f.address) FROM Farmer f WHERE f.farmerId=:fid";
		return mgr.createQuery(jpql, Farmer.class).setParameter("fid", id).getSingleResult();
	}

	@Override
	public List<StockDetails> getAllProduct() {
		String jpql = "SELECT NEW com.marketplace.pojos.StockDetails(s.id, s.stockItem, s.quantity, s.pricePerUnit, s.category, s.imagePath) FROM StockDetails s";
		return mgr.createQuery(jpql, StockDetails.class).getResultList();
	}

	@Override
	public Farmer getFarmerByEmail(String email) {
		try {
			String jpql = "SELECT f FROM Farmer f WHERE f.email=:email";
			return mgr.createQuery(jpql, Farmer.class).setParameter("email", email).getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public boolean addProduct(StockDetails product) {
		try {
			mgr.persist(product);
			mgr.flush();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public boolean updateProduct(int productId, StockDetails updatedProduct) {
		try {
			StockDetails existing = mgr.find(StockDetails.class, productId);
			if (existing != null) {
				existing.setStockItem(updatedProduct.getStockItem());
				existing.setQuantity(updatedProduct.getQuantity());
				existing.setPricePerUnit(updatedProduct.getPricePerUnit());
				existing.setCategory(updatedProduct.getCategory());
				if (updatedProduct.getImagePath() != null) {
					existing.setImagePath(updatedProduct.getImagePath());
				}
				mgr.merge(existing);
				mgr.flush();
				return true;
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public boolean deleteProduct(int productId) {
		try {
			StockDetails product = mgr.find(StockDetails.class, productId);
			if (product != null) {
				mgr.remove(product);
				mgr.flush();
				return true;
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public List<?> getSellerSales(int farmerId) {
		try {
			String jpql = "SELECT NEW com.marketplace.pojos.OrderDetails(od.id, od.orderItem, od.quantity, od.amount, od.orders) " +
						 "FROM OrderDetails od WHERE od.farmer.farmerId = :farmerId ORDER BY od.orders.placeOrderDate DESC";
			return mgr.createQuery(jpql).setParameter("farmerId", farmerId).getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<>();
		}
	}

	@Override
	public Object getSellerStats(int farmerId) {
		try {
			// Get total products
			String productCountJpql = "SELECT COUNT(s) FROM StockDetails s WHERE s.farmer1.farmerId = :farmerId";
			Long totalProducts = mgr.createQuery(productCountJpql, Long.class)
									.setParameter("farmerId", farmerId)
									.getSingleResult();

			// Get total orders and revenue
			String orderStatsJpql = "SELECT COUNT(od), SUM(od.quantity), SUM(od.amount) " +
								   "FROM OrderDetails od WHERE od.farmer.farmerId = :farmerId";
			Object[] orderStats = (Object[]) mgr.createQuery(orderStatsJpql)
												.setParameter("farmerId", farmerId)
												.getSingleResult();

			// Get unique buyers count
			String uniqueBuyersJpql = "SELECT COUNT(DISTINCT od.orders.user.userId) " +
									 "FROM OrderDetails od WHERE od.farmer.farmerId = :farmerId";
			Long uniqueBuyers = mgr.createQuery(uniqueBuyersJpql, Long.class)
								  .setParameter("farmerId", farmerId)
								  .getSingleResult();

			int totalOrders = orderStats[0] != null ? ((Long) orderStats[0]).intValue() : 0;
			int totalQuantitySold = orderStats[1] != null ? ((Long) orderStats[1]).intValue() : 0;
			double totalRevenue = orderStats[2] != null ? ((Double) orderStats[2]) : 0.0;

			return new SellerStats(
				totalProducts.intValue(),
				totalOrders,
				totalQuantitySold,
				totalRevenue,
				uniqueBuyers.intValue()
			);
		} catch (Exception e) {
			e.printStackTrace();
			return new SellerStats(0, 0, 0, 0.0, 0);
		}
	}

	@Override
	public boolean updateSellerProfile(int farmerId, Farmer updatedProfile) {
		try {
			Farmer existing = mgr.find(Farmer.class, farmerId);
			if (existing != null) {
				existing.setFirstname(updatedProfile.getFirstname());
				existing.setLastname(updatedProfile.getLastname());
				existing.setEmail(updatedProfile.getEmail());
				existing.setPhoneNo(updatedProfile.getPhoneNo());
				existing.setAddress(updatedProfile.getAddress());
				mgr.merge(existing);
				mgr.flush();
				return true;
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
}
