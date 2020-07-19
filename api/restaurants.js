var express  = require('express');
var router   = express.Router();
var getConnection = require('../config/db');
var util     = require('../util');
var auth     = require('../logged');


// 지금 배달 가능한 레스토랑 목록 보여주기
router.get('/', function(req,res,next){
   
    
    
    getConnection((conn)=>{
        var sql = "select * from company where isOpen=1 order by rand() LIMIT 3;"
        conn.query(
            sql, // excute sql
            [], // ? <- value
            function(err, result){
                if(err){
                    console.error(err);
                    res.json(util.successFalse(err));
                    throw err;
                }
                else {
                    var restaurants=[]
                    result.forEach(function(element){
                        var restaurant={
                            'id':element.companyKey,
                            'name':element.name,
                            'phone':element.phone,
                            'address':element.address,
                            'img':element.img,
                            'description':element.description,
                            'category':element.categoryKey,
                            'isOpen':element.isOpen,
                            'foodImg':element.foodImg,
                            'detailDescription':element.detailDescription,
                            'likeNum' : element.likeNum

                        }
                        restaurants.push(restaurant)
                        
                    });
                    res.json(util.successTrue(restaurants,'식당 목록'))
                }
        })
        conn.release();
    });
});

router.get('/:id', function(req,res,next){
   
    var companyKey=req.params.id;
    
    getConnection((conn)=>{
        var sql = "SELECT * FROM company AS C INNER JOIN item AS I ON C.companyKey=I.companyKey WHERE C.companyKey=?"
        conn.query(
            sql, // excute sql
            [companyKey], // ? <- value
            function(err, result){
                if(err){
                    console.error(err);
                    res.json(util.successFalse(err));
                    throw err;
                }
                else {
                    var items=[]
                    result.forEach(function(element){
                        var item={
                            'id':element.itemKey,
                            'name':element.iName,
                            'price':element.price,
                            'img':element.iImg,
                            'recipe':element.recipe,

                            'description':element.iDescription,
                            

                        }
                        items.push(item)
                        
                    });
                    var restaurant={
                        'id':result[0].companyKey,
                        'name':result[0].name,
                        'phone':result[0].phone,
                        'address':result[0].address,
                        'img':result[0].img,
                        'description':result[0].description,
                        'category':result[0].categoryKey,
                        'isOpen':result[0].isOpen,
                        'foodImg':result[0].foodImg,
                        'detailDescription':result[0].detailDescription,
                        'likeNum' : result[0].likeNum,

                        'items':items
                    }
                   
                    res.json(util.successTrue(restaurant,'식당 상세'))
                }
        })
        conn.release();
    });
});


router.patch('/:id/likenum',auth, function(req,res,next){
   
    var companyKey=req.params.id;
    
    getConnection((conn)=>{
        var sql = "update company set likeNum=likeNum+1 where companyKey=?"
        conn.query(
            sql, // excute sql
            [companyKey], // ? <- value
            function(err, result){
                if(err){
                    console.error(err);
                    res.json(util.successFalse(err));
                    throw err;
                }
                else {


                    res.json(util.successTrue(null,'좋아요 추가'))
                }

            })
            conn.release();
        });
    });
    

module.exports = router;