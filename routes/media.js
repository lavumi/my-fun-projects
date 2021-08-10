// var express = require('express');
// var router = express.Router();

// const fs = require('fs');
// const path = require('path');
// // const async = require('async');


// const mediaPath = path.join(__dirname , "../public");
// var readdir = function (dir, callback) {
//     var results = [];
//     fs.readdir(dir, function (err, list) {
//         if (err) return callback(err);
//         var i = 0;
//         (function next() {
//             var file = list[i++];
//             if (!file) return callback(null, results);
//             if (file[0] === '.') {
//                 // console.log(file + " skipped");
//                 next();
//             }
//             else {
//                 file = path.resolve(dir, file);
//                 fs.stat(file, function (err, stat) {
//                     if (stat && stat.isDirectory()) {
//                         readdir(file, function (err, res) {
//                             if (!res) {
//                                 // console.log(file, res);
//                             }
//                             results = results.concat(res);

//                             next();
//                         });
//                     } else {
//                         results.push(file.replace(mediaPath, ''));
//                         next();
//                     }
//                 });
//             }
//         })();
//     });
// };


// var g_fileList = {};

// function loadData(){

//     readdir(path.join(mediaPath , 'symMedia/downloads'), (err, file_list) => {
//         // g_fileList['downloads'] = file_list;
//         file_list.forEach(element => {
//             if (element.indexOf('런닝맨') !== -1 && element.indexOf('.mp4') !== -1){
//                 // console.log(path.join(mediaPath, 'symMedia/RunningMan' , path.basename(element)));
//                 fs.renameSync( 
//                     path.join(mediaPath,element), 
//                     path.join(mediaPath, 'symMedia/RunningMan' , path.basename(element)));
//             }
//             else if (element.indexOf('.mp4') !== -1){
//                 fs.renameSync( 
//                     path.join(mediaPath,element), 
//                     path.join(mediaPath, 'symMedia/Etc' , path.basename(element)));
//             }

//             //todo 
//             //erase empty folder
//             //get strange ext????
//         });
//     });





//     readdir(path.join(mediaPath , 'symMedia/RunningMan'), (err, file_list) => {
//         // console.log( file_list );
//         g_fileList['RunningMan']= file_list;
//     });
    
//     readdir(path.join(mediaPath , 'symMedia/InfinityChallange'), (err, file_list) => {
//         g_fileList['InfinityChallange'] = file_list;
//     });
    
//     readdir(path.join(mediaPath , 'symMedia/Etc'), (err, file_list) => {
//         g_fileList['Etc'] = file_list;
//     });
    

// }

// loadData();

// router.get('/', (req, res) => {
//     if (!!req.query.title) {
//         res.render('movie', {
//             title: req.query.title,
//             ext  : req.query.ext
//         })
//     }
//     else {
//         res.render('mediaList', {
//             title: 'Lavumi Media Server',
//             _fileList: g_fileList
//         });
//     }
        
// });

// router.post('/', (req, res) => {
//     loadData();
//     res.render('mediaList', {
//         title: 'Lavumi Media Server',
//         _fileList: g_fileList
//     });
// });


// module.exports = router;