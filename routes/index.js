/**
 * 路由
 * @param app
 */
var crypto = require('crypto'),
    User = require('../models/user');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.get('/reg', function (req, res) {
        console.log(req.session);
        //
        res.render('reg', {
            title: '注册',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];

        //检查用户输入的两次密码是否一致
        if (password != password_re) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');

        }
        //生成密码的MD5值
        var md5 = crypto.createHash('md5'),
            password = md5.update(password).digest('hex');
        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email
        });
        //检查用户名是否存在

        User.get(newUser.name, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }

            if (user) {
                req.flash('error', '用户已经存在!');
                return res.redirect('/reg');
            }

            ////如果用户不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = user;//用户信息存入session
                req.flash('success', '注册成功');
                res.redirect('/');//注册成功后返回主页
            });
        })
    });
    app.get('/login', function (req, res) {
        res.render('login', {title: '登录'});
    });
    app.post('/login', function (req, res) {

    });
    app.get('/post', function (req, res) {
        res.render('post', {title: '发表'});
    });
    app.post('/post', function (req, res) {

    });
    app.get('/logout', function (req, res) {

    });
};
