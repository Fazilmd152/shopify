class APIFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }


    Search() {
        let keyWord = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}


        this.query.find({ ...keyWord })
        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr }
        const removeFields = ["keyword", "limit", "page"]
        removeFields.forEach(field => delete queryStrCopy[field])

        //category
        if (queryStrCopy.category) {
            const categories = queryStrCopy.category.split(',').map(category => category.trim());
            queryStrCopy.category = { $in: categories };
        }

        //price filter
        let queryStr = JSON.stringify(queryStrCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)


        //Ratings filter
        if (queryStrCopy.ratings) {
            const ratings = queryStrCopy.ratings.split(',').map(Number);
            const queries = ratings.map((rating) => {
                return {
                    ratings: { $lte: rating, $gte: rating - 0.9 }
                };
            });
            queryStr = JSON.stringify({ $or: queries });
        } else {
            queryStr = queryStr;
        }



        this.query.find(JSON.parse(queryStr))
        return this

    }

    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip)
        return this

    }
}


module.exports = APIFeatures