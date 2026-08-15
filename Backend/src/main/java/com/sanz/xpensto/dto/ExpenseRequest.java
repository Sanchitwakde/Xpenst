package com.sanz.xpensto.dto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ExpenseRequest{
    private Double amount;
    private String item;
    private String category;
    private LocalDate date;
    private Long userId;
}