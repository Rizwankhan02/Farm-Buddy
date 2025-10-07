package com.marketplace.service;

import java.util.List;
import com.marketplace.pojos.Farmer;
import com.marketplace.pojos.StockDetails;

public interface IFarmersService {
	
	List<Farmer> getFarmersList();
	Farmer getFarmerDetails(int id);
	Farmer getFarmerByEmail(String email);
	List<StockDetails> getFarmerStock(int farmerid);
	StockDetails getProductDetails(int farmerid, int productid);
	List<StockDetails> getAllProduct();
	boolean addProduct(StockDetails product);
	boolean updateProduct(int productId, StockDetails updatedProduct);
	boolean deleteProduct(int productId);
	List<?> getSellerSales(int farmerId);
	Object getSellerStats(int farmerId);
	boolean updateSellerProfile(int farmerId, Farmer updatedProfile);
	
}
