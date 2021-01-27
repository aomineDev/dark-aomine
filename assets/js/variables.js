// VARIABLES

// Body
const $body = document.body;

// Loading
const $loading = document.querySelector('.loading');

// Nav
const $header = document.querySelector('.header'),
$nav = document.querySelector('.nav'),
$navLinks = document.querySelectorAll('.nav-link'),
$navItems = document.querySelectorAll('.nav-item'),
$section = document.querySelectorAll('section');
var headerH,
sections = [],
scrollPosition;

// blog
const $postText = document.querySelectorAll('.blog-post-text'),
$postBtn = document.querySelectorAll('.btn-leer-mas');
var postTextBackUp = [],
postTextNew = [],
postTextCount= [];
postTextIndex = 0,
postTextIndexCount = 0,
postBtnCount = [];

// footer year
const $year = document.getElementById('year');
var date = new Date();