package com.marketplace.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.marketplace.dao.IFarmersDao;
import com.marketplace.pojos.Farmer;
import com.marketplace.pojos.StockDetails;


@Service
@Transactional
public class FarmersServiceImpl implements IFarmersService {

	@Autowired
	private IFarmersDao f_dao;
	
	@Override
	public List<Farmer> getFarmersList() {
		return f_dao.getAllFarmers();
	}

	@Override
	public List<StockDetails> getFarmerStock(int farmerid) {
		return f_dao.getFarmerStock(farmerid);
	}

	@Override
	public StockDetails getProductDetails(int farmerid, int productid) {
		return f_dao.getProductDetails(farmerid, productid);
	}

	@Override
	public Farmer getFarmerDetails(int id) {
		return f_dao.getFarmerDetails(id);
	}

	@Override
	public List<StockDetails> getAllProduct() {
		return f_dao.getAllProduct();
	}

	@Override
	public Farmer getFarmerByEmail(String email) {
		return f_dao.getFarmerByEmail(email);
	}

	@Override
	public boolean addProduct(StockDetails product) {
		return f_dao.addProduct(product);
	}

	@Override
	public boolean updateProduct(int productId, StockDetails updatedProduct) {
		return f_dao.updateProduct(productId, updatedProduct);
	}

	@Override
	public boolean deleteProduct(int productId) {
		return f_dao.deleteProduct(productId);
	}

	@Override
	public List<?> getSellerSales(int farmerId) {
		return f_dao.getSellerSales(farmerId);
	}

	@Override
	public Object getSellerStats(int farmerId) {
		return f_dao.getSellerStats(farmerId);
	}

	@Override
	public boolean updateSellerProfile(int farmerId, Farmer updatedProfile) {
		return f_dao.updateSellerProfile(farmerId, updatedProfile);
	}
	
}
