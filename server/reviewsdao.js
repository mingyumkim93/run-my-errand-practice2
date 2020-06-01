const mysqlConn = require("./mysqlhelper");

const reviewsDao = {
    createReview(review){
        return mysqlConn.query("insert into reviews set ?", review);
    }
};

module.exports = reviewsDao;