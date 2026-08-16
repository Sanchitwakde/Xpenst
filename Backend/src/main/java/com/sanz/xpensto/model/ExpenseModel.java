package com.sanz.xpensto.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // Jackson is responsible for converting Java objects into JSON
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter; //Lombok is used to remove the get and set boilerplate
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
@Entity //entity class that tells that this class should be mapped to db table
@Table(name = "expenses")
public class ExpenseModel {
    @Id // to set primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // to auto generate id's
    private long id;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    private double amount;

    @NotBlank(message = "Item is required")
    private String item;

    @NotBlank(message = "Category is required")
    private String category;
    @NotNull(message = "Date is required")
    private LocalDate date; // date of purchase

    private LocalTime createdAt; // time at which the expense was created (for db)

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private UserModel user;

    public ExpenseModel(double amount, String item, String category, LocalDate date, UserModel user){
        this.amount = amount;
        this.item = item;
        this.category = category;
        this.date = date;
        this.user = user;
    }

    public ExpenseModel() { //empty constructor so that jpa can fill the fields
    }


    @PrePersist
    public void prePersist(){
        this.createdAt = LocalTime.now();
    }
}
