package com.marketplace.pojos;

public class SellerStats {
    private int totalProducts;
    private int totalOrders;
    private int totalQuantitySold;
    private double totalRevenue;
    private int uniqueBuyers;
    
    public SellerStats() {}
    
    public SellerStats(int totalProducts, int totalOrders, int totalQuantitySold, double totalRevenue, int uniqueBuyers) {
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalQuantitySold = totalQuantitySold;
        this.totalRevenue = totalRevenue;
        this.uniqueBuyers = uniqueBuyers;
    }
    
    // Getters and setters
    public int getTotalProducts() {
        return totalProducts;
    }
    
    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }
    
    public int getTotalOrders() {
        return totalOrders;
    }
    
    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }
    
    public int getTotalQuantitySold() {
        return totalQuantitySold;
    }
    
    public void setTotalQuantitySold(int totalQuantitySold) {
        this.totalQuantitySold = totalQuantitySold;
    }
    
    public double getTotalRevenue() {
        return totalRevenue;
    }
    
    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    
    public int getUniqueBuyers() {
        return uniqueBuyers;
    }
    
    public void setUniqueBuyers(int uniqueBuyers) {
        this.uniqueBuyers = uniqueBuyers;
    }
    
    @Override
    public String toString() {
        return "SellerStats{" +
                "totalProducts=" + totalProducts +
                ", totalOrders=" + totalOrders +
                ", totalQuantitySold=" + totalQuantitySold +
                ", totalRevenue=" + totalRevenue +
                ", uniqueBuyers=" + uniqueBuyers +
                '}';
    }
}
