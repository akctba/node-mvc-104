const path = require('path');
const fs = require('fs');

const rootDirectory = require('../util/path');
const dataPath = path.join(rootDirectory, 'data', 'Products.json');

module.exports = class Product{
    constructor(name, price){
        this.id = Math.random();
        this.name = name;
        this.price = price;
    }

    save(){
        fs.readFile(dataPath, (err, data) => {
            let tempProducts = [];
            if(!err){
                tempProducts = JSON.parse(data);
            }
            tempProducts.push(this);
            fs.writeFile(dataPath, JSON.stringify(tempProducts,null,2), err => {
                if(err) throw err;
            })
        })
    }

    static fetchAll(cb){
        // this is async, good for large data
        fs.readFile(dataPath, (err, data) => {
            if(err){
                // return [];
                cb([]);
            }else{
                cb(JSON.parse(data));
            }
            // return JSON.parse(data);
        })

        // this is synchronous, good for small scale data
        // return JSON.parse(fs.readFileSync(dataPath));
    }

    static fetchOneProduct(id){
        const products = JSON.parse(fs.readFileSync(dataPath));
        const found = products.some(prod => prod.id == id);

        if(found){
            return products.find(prod => prod.id == id);
        }else{
            return { msg: `Product with id of (${id}) is not found!`}
        }
    }

    static deleteById(productid, cb) {

        fs.readFile(dataPath, (err, data) => {
            if(err) {
                cb({
                    msg: 'It was not possible to find product ' + productid
                });
            } else {
                let products = JSON.parse(data);
                let newList = products.filter(p => p.id !== Number(productid));

                fs.writeFile(dataPath, JSON.stringify(newList,null,2), err => {
                    if(err) throw err;
                    cb(newList);
                })

            }
        })
    }

}