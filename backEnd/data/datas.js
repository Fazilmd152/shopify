const axios=require('axios')
const fs=require('fs')
const path =require('path')




    axios.get("https://fakestoreapi.in/api/products").then(async d =>{
       const  data=  d.data.products
//code below is to find unique data
//        const uniqueCategories = data.map(d => d.category).filter((value, index, self) => self.indexOf(value) === index);
// console.log(uniqueCategories)

 

      const productsNew=  data.map(d=>{
            const sellers =["Amazon","flipkart","Ebay"]
          return   {
                name:d.title,
                price:d.price,
                description:d.description,
                ratings:Math.floor(Math.random() * 10) / 2,
                images:[{image:d.image}],
                category:d.category,
                seller:sellers[Math.floor(Math.random() * sellers.length)],
                stock:Math.floor(Math.random() * 10) + 1,
                numOfReviews:0,
                reviews:[]
                
            }
        })
        
        fs.writeFile(path.join(__dirname,'testdata.json'),JSON.stringify(productsNew,null,2),(err)=>{
           console.log(err);
        })
            
        
       
    })