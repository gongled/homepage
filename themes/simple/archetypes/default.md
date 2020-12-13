---
title: {{ replaceRE "[0-9]{2,}" "" .Name | replaceRE "^-*" "" | replaceRE "-" " " | title }}
date: {{ .Date }}
lastmod: 
author: Gleb Goncharov

description: 
categories: []
tags: []

draft: false
enableDisqus : false
enableMathJax: false
disableToC: false
disableAutoCollapse: true
---