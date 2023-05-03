## https://documenter.getpostman.com/view/24874711/2s935smgSL => POSTMAN DOCUMENTATION

# WELCOME to Bookstore REPORT API

## Rest Arhitectur - 2000 онд Roy Thomas Field докторын ажлаараа энэ архитекурыг танилцуулжээ

## 0 ) RESTful архитектурын ДИЗАЙНЫ ЗУРГААН ШААРДЛАГА Юуг RESTful апи гэх вэ?

### 1. Клиент/ сервэр арихтектур

### 2. Нэгдсэн интерфейсээр хандах (uniform interface)

### 3. Сервэр тал аппын төлөвийг хадгалж явах ёсгүй

### 4. Төрөл бүрийн шатанд КЭШЛЭХ(CACHED) боломжтой

### 5. Тусдаа бие даан ажиллах үе давхаргуудаас тогтох (Layered)

### 6. Шаардлагатай үед сервэрээс клиент руу нэмэлт код өгөх ( code on demand )

## 7) Json хариулт буцаах, URL-р параметер дамжуулах Категоритой ажиллах тест endpoint үүсгэж турших

```C
    app.get("/",(req,res) => {
        res.send("Oke")
    })
    // OR
    app.get("/",(req,res) => {
        res.json({
            success: true,
            data: `${req.params.id} id-тэй категорыг энэд өгнө...`..
        })
    })
```

## 8) Express Router холбох Категоритой ажиллах router үүсгэн ашиглах

```C
    Server.js
        const categoriesRoutes = require('./routes/category')
        app.use('/api/v1/categories',categoriesRoutes);
    /routes/category.js
        const router = express.Router();
        const {
        getCategories,
        createCategory,
        } = require("../controller/category");
        router.route("/").get(getCategories).post(createCategory); //controller-s data avah
        module.exports = router;//Exportloh heregtei
```

## 9) Категоритой ажиллах контроллер үүсгэн ашиглах

```C
    /controller/category.js
        exports.deleteCategory = (req, res, next) => {
            res.status(200).send({
                success: true,
                data: `${req.params.id} id-тэй категори-г усгана...`
            })
        }
```

## 10) Middleware гэж юу вэ? Хүсэлт бүрийг лог хийх өөрийн middleware бичих, Morgan logging middleware ашиглах

```C
    //Example next();
    const consolelog = (req, res, next) => {
        console.log(`${req.method} ${req.protocol}://${req.host}${req.originalUrl}`);
        next();
    }
    //Example 2 Morgan using
    var path = require('path')
    var morgan = require('morgan')
    var rfs = require('rotating-file-stream')

    var accessLogStream = rfs.createStream('access.log', {
        interval: '1d',
        path: path.join(__dirname, 'log')
    })
    app.use(morgan('combined', { stream: accessLogStream }))
```

## 11) MongoDB Atlas дээр cluster үүсгэж MongoDB Compass ашиглаж холбогдох

```C
    Орчноо бэлдэх: https://mongodb.com/
    compass суулгах: https://www.mongodb.com/products/compass
```

## 12) Mongoose ODM суулгаж MongoDB өгөгдлийн сантай холбогдох

```C
    npm i mangoose
```

## 13) Console дээр өнгөтэй хэвлэх Color пакэжийг суулгаж ашиглах

```C
    $ npm i colors
```

## 14) Mongoose дээр Категорийн моделийг үүсгэх

```C
    //Body Parser - Энэ нь шинээр req ирхэд express.н json-д өгөх гэж
    app.use(express.json());
    try{
    const category = await Category.create(req.body);
    res.status(200).json({
      success: true,
      data: category,
    });
  }
  catch(err){
    res.status(400).json({
      success: false,
      error: err,
    });
  }
```

## 15) Category модел ашиглан категориудыг үүсгэх апи бичиж турших

```C
    const mongoose = require("mongoose");
    const CategorySchema = new mongoose.Schema({
        name:{
            type: String,
            required: [
                true,'Категорийн нэрийг оруулна уу',
            ],
            unique: true,
            trim:true,
            maxLength: [50, 'Катгорийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой'],
        },
        description: {
            type: String,
            required: [
                true, 'Категорийн тайлбарыг заавал оруулна уу'
            ],
            maxlength: [500, 'Катгорийн тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой']
        }
    })
    module.exports = mongoose.model("Category",CategorySchema)
```

## 16) Category модел ашиглан бүх категориудыг авах, нэг категорийг авах апи бичиж турших

```C
    27-р ажилтай ижилхэн
    getAll => const category = await Category.find();
    getId =>  const category = await Category.findById(); OR const category = await Category.find({photo: req.params.id});
```

## 17) Category модел ашиглан бүх категори өөрчлөх, устгах апи бичиж турших

```C
    Update:
        const category = await Category.findByIdAndUpdate(req.params.id, req.body,{
                new: true,//Шинэчлэгдсэн мэдээллийг өгнө
                runValidators: true,//Баз үүсгэж байхдаа гаргаж байасн шалгалтыг бас шалгаж өгөөрэй гэж хэлж өгнө,
            });
        }

    Delete:
        const category = await Category.findByIdAndDelete(req.params.id);
```

## 18) Алдааг боловсруулах өөрийн middleware бичих

```C
midleware error.js
const ErrorHandler = (err, req, res, next) => {
    console.log(err.stack.cyan.undeline);
    res.status(500).json({
        success: false,
        error: err.message
    })
    next();
}
module.exports = ErrorHandler

server.js
const ErrorHandler = require('..error.js')
app.use(ErrorHandler)


using controller in category.js
    catch(err){
        next(err);
    }
```

## 19) Custom Error буюу апп даяар хэрэглэгдэх өөрийн алдааны обьектийг бичиж ашиглах

```C
    class CustomError extends Error {
        constructor(message, statusCode)
        {
            super(message)

            this.statusCode = statusCode
        }
    }

    module.exports = CustomError

    Ашиглахдаа
    const category = await Category.findById(req.params.id);
    if(!category)
    {
      throw new CustomError(`${req.params.id}-ийм ID-тай Категори олдсонгүй ..`,400)
    }
```

## 20) asyncHandler функц бичиж контроллертоо ашиглах

```C
const asyncHandler = fn => (res, req, next)=> {
    Promise.resolve(fn((res, req, next))).catch(next)
}
module.exports = asyncHandler
  ||
  \/
const asyncHandler = require('../middleware/asyncHandler')
USING
exports.getCategory = asyncHandler(async(req, res, next) => {
    const category = await Category.findById(req.params.id);
    if(!category)
    {
      throw new CustomError(`${req.params.id}-ийм ID-тай Категори олдсонгүй ..`,400)
    }
    res.status(200).json({
      success: true,
      data: category,
    });
});
```

### ЭСВЭЛ NPM Ашиглах

```C
    cmd: npm install --save express-async-handler
    const asyncHandler = require('express-async-handler')
    exports.getCategory = asyncHandler(async(req, res, next) => {
    const category = await Category.findById(req.params.id);
    if(!category)
    {
      throw new CustomError(`${req.params.id}-ийм ID-тай Категори олдсонгүй ..`,400)
    }
    res.status(200).json({
      success: true,
      data: category,
    });
});
```

## 21) MongoDB дээр Query хийж өгөгдөл шүүх нь Документ, нийлмэл документ, массиваас шүүх

```C
    db.tableNM.find({}) = (Bidnii Ashgladag SQL) => select * from tableNM
    db.tableNM.find({status : "0"}) = (Bidnii Ashgladag SQL) => select * from tableNM where status = "0"
    db.tableNM.find({status : "0"} {status: 1, item: 1}) = (Bidnii Ashgladag SQL) => select _id(default), status,item  from tableNM where status = "0"
    db.tableNM.find({status : "0"} {status: 1, item: 1,_id:0(false)}) = (Bidnii Ashgladag SQL) => select  status,item  from tableNM where status = "0"
    [https://www.mongodb.com/docs/manual/reference/operator/query/]
```

## 22) Категориудаас нэрээр, дундаж үнээр, рэйтингээр шүүх Категори үүсгэж байхад автоматаар рэйтингийг middleware дотор үүсгэх

```C
    Queries Docs
        [https://mongoosejs.com/docs/queries.html]
    Pre deer baseruu ogogdol unshih esvel bhched bnga duudagdah uyd hj ogn
        this.averagePrice = Math.floor(Math.random()*100000)+3000;
    Huselt ywuulhdaa
        const category = await Category.find(req.query);
    Postman: find
        /api/v1/categories?averagePrice[$gte]=66589
```

## 23) Категориудаас талбарыг нь сонгож авах, эрэмбэлэх Select, Sort хийх нь

```C
    select = req.query.select || {};
    sort = req.query.sort || {};
    resolve=req.query.resolve || {};
    delete req.query.select,req.query.sort,req.query.resolve;
    console.log('deleted All',req.query);
    const category = await Category.find(req.query,select).sort("-"+sort);
```

## 24) Категориудыг хуудаслах буюу PAGINATION хэрхэн хийх вэ?

```C
    REST API руу дамжуулах утгаад
    - page: Хэддүгээр хуудасны мэдээллэийг авахыг заана
    - limit: Нэг хуудсанд хэдэн үр дүн байхыг заана
    Бодож олох аргууд
    - total: Нийт элементийн тоо: Базаас авна
    - pageCount: Нийт хуудасны тоо: Math.ceil(total/limit)
    - start: Заагдсан хуудасны эхлэх элементийн дэс дугаар: (pages-1)*limit+1
    - end: Заагдсан хуудасны төгсөн элементийн дэс дугаар: start+limit-1 || total
    - nextPage: Дараачийн хуудасны дугаар: page+1 || udefined
    - prevPage: Өмнөх хуудасны дугаар: page-1 || udefined
```

## 25) Категориудыг хуудаслалтын кодыг бичих хэсэг, Mongoose skip, limit ашиглах

## 26) Mongoose Virtuals гэж юу вэ? Virtuals, populate ашиглан холбоотой документуудын мэдээллийг татаж үзүүлэх

```C
    .populate('books'); //getCategory req ywuulhad books talbar nemeh
    //model hesegt
    ,{ toJSON: {virtuals: true}, toObject: {virtuals: true}}
    //Categortoo
    CategorySchema.virtual('books',{
        ref:'Book',//Book talbaraas avah
        localField: '_id',//Categor-n id-aar
        foreignField: 'category',//Category-n _id -tei Books talbaraas ijilhn category-n nomnuudn mdeellg avna
        justOne: false
    })
```

## 27) Mongoose PRE middleware ашиглан категорийг устгахад уг категорийн номнуудыг давхар устгах нь, Mongoose SAVE функцээр өөрчлөх

```C

    //controller/categore.js
    const category = await Category.findByIdAndDelete(req.params.id);
    if(!category)
    {
      throw new CustomError(`${req.params.id}-ийм ID-тай Категори олдсонгүй ..`,400)
    }
    //үүнийг өөрчилж бичих тэгэхгүй бол mongoose дээр remove үзэгдлийг барьж чадахгүй байх магадлалтай
    const category = await Category.findById(req.params.id);
    if(!category)
    {
      throw new CustomError(`${req.params.id}-ийм ID-тай Категори олдсонгүй ..`,400)
    }
    category.remove();

    //model/categore.js
    CategorySchema.pre('remove',async function(next) {
        console.log('remove...');
        await this.model('Book').deleteMany({category: this._id})
        next();
    });
```

## 28) Номын зургийг upload хийх апи бичицгээе! Зөвхөн зураг upload хийх ба заагдсан хэмжээнээс хэтрэхгүй байх зэргийг шалгана

```C
    bash: npm i express-fileupload
    const file = req.files.file;
    //file type check
    if(!file.mimetype.startsWith("image")){
      /*..err type.message*/
    };
    //file size check
    if(file.size>process.env.IMAGE_SIZE){
      /*...err size.message*/
    }
    file.mv(`/*file-url*/`,err=>{
        ...err message
    })
```

## 29) Хэрэглэгчийг бүртгэх, нууц үгийг bcrypt ашиглан шифрлэн хадгалах

```C
    bash: $ npm i bcrypt --save
    //passiig oilgomjgui blgj oorchlnoo ingsneer hack-s baga zrg secure hgdj ognoo

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
```

## 30) Bcrypt болон md5 хэшийн тухай, brute force халдлага гэж юу болох, хэрхэн сэргийлэх

```C
    https://www.md5hashgenerator.com/
```

## 31) JWT гэж юу вэ? Хэрэглэгчийг амжилтттай бүртгэсний дараа JWT токенийг буцаах

```C
    https://www.npmjs.com/package/jsonwebtoken
    bash: $ npm install jsonwebtoken
```

## 32) Хэрэглэгчийн логин хийх endpoint-ийг бичих

```C
    //Manage Controller
        const { email, password } = req.body;
        if(!email || !password){
            //err message
        }
        const user = await Manage.findOne({email}).select("+password");
        if(!user){
            //err message
        }
        const ok = await user.CheckPass(password);
        if(!ok){
            //err message
        }
        res.status(200).json({
            success: true,
            token: user.getJsonWebToken(),
            user: user
        })
    // model
        UserSchema.methods.CheckPass = async function(password) {
            return await bcrypt.compare(password,this.password);
        }
    // router
        router.route('/login')
                .post(loginUser);
```

## 33) Endpoint-уудыг токеноор хамгаалах defend middleware бичиж ашиглах

```C
    exports.defend = asyncHandler(async(req,res,next) => {
        if(!req.headers.authorization){
            throw new CustomError('Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна',400)
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            throw new CustomError('Токен байхгүй байна',401)
        }
        const ObjToken = jwt.verify(token,process.env.JWT_BOOK_SECRET);
        req.user = ObjToken.id;
        req.role = ObjToken.roler;
        next();
    });
```

## 34) User, Operator, Admin эрхүүдийг ашиглан хандах ажиллах эрхийг хязгаарлах authorize middleware бичих

```C
exports.authorizer = (...roler) =>{
    return(req,res,next) => {
        if(!roler.includes(req.role)){
            throw new CustomError('Таны эрх ['+req.role+'] энэ үйлдлийг хийх боломжгүй',403);
        }
        next();
    }
}
```
