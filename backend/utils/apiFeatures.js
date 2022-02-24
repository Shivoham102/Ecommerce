const express = require('express');
const mongoose = require("mongoose");
const Product = mongoose.model('Product');
class ApiFeatures{
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword
        ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i',
            },

        } 
        : {

        }
        console.log(keyword);

        this.query = this.query.find(keyword);
        return this;
    }

    filter() {
        const queryCopy = {...this.queryString};
        const remove = ["keyword", "page", "limit"];

        remove.forEach(key => delete queryCopy[key]);

        //Filter for Price and Rating
        let queryinString = JSON.stringify(queryCopy);        
        console.log(queryinString);
        queryinString = queryinString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryinString));
        // Product.find().where("price").gt(15000).lt(260000)
        //             .exec((err, res) => {
        //                 this.query = res
        //             })
        // console.log(queryCopy);
        return this;
    }

    paginate(resultsPerPage) {
        const currentPage = Number(this.queryString.page) || 1;

        const skip = resultsPerPage * (currentPage - 1)

        this.query = this.query.limit(resultsPerPage).skip(skip)

        return this;
    }
}

module.exports = ApiFeatures;