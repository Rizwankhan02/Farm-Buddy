
package com.marketplace.pojos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Entity
@Table(name = "category")
public class Category{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "category_name", unique = true)
    private String categoryName;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<StockDetails> stockDetails;

    // Custom no-args constructor
    public Category() {
        System.out.println("Category Constructor invoked");
    }

    public Category(String categoryName) {
        this.categoryName = categoryName;
    }

    public Category(Integer categoryId, String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Category(Integer categoryId) {
        this.categoryId = categoryId;
    }

    // Getters & setters
    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer aCategoryId) {
        categoryId = aCategoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String aCategoryName) {
        categoryName = aCategoryName;
    }

    public List<StockDetails> getStockDetails() {
        return stockDetails;
    }

    public void setStockDetails(List<StockDetails> aStockDetails) {
        stockDetails = aStockDetails;
    }

    @Override
    public String toString() {
        return "Category [categoryId=" + categoryId + ", categoryName=" + categoryName + ", stockDetails=" + stockDetails + "]";
    }
}
