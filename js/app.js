var cats_folder = 'images/';

var cat = function (name, img, click) {
    if (img.search(cats_folder) !== -1){
        this.img = img;
    } else {
        this.img = cats_folder + img;
    }
    this.name = name || 'Noname';
    this.clicks = click || 0;
};

var catModel = {
    currentCat: null,
    currentCatdId: null,
    cats: {
        cat1: new cat ('Mustaches Cat', 'cat1.png', 0),
        cat2: new cat ('Pretty Cat', 'cat2.png', 0),
        cat3: new cat ('Red Toung Cat', 'cat3.png', 0),
        cat4: new cat ('Tail Cat', 'cat4.png', 0),
        cat5: new cat ('Mommy Cat', 'cat5.png', 0)
    }
};

var catUpdateView = {
    init: function (){
        var that = this;
        this.updateBttn = '.updateCat';
        this.elParent = '.updateCatContent';
        this.elName = $(this.elParent + ' .name');
        this.elCounter = $(this.elParent + ' .clicks');
        this.elImg = $(this.elParent + ' .img_url');
        this.saveBttn = $(this.elParent + ' .saveCat');
        
        //add click for updateButton
        $(this.updateBttn).on('click', function(){
            $(that.elParent).toggle();
        });
        
        //save updated view
        $(this.saveBttn).on('click', function(){
            var newName = $(that.elName).val();
            var newClicks = $(that.elCounter).val();
            var newImg = $(that.elImg).val();
            catController.saveCat(newName, newImg, newClicks);
        });
        
        return this.render();
    },
    render: function (){
        var currCat = catController.getCurrentCat();
        var currName = currCat.name;
        var currImg = currCat.img;
        var currClicks = currCat.clicks;
        
        $(this.elName).val(currName);
        $(this.elImg).val(currImg);
        $(this.elCounter).val(currClicks);
    }
};

var catListView = {
    init: function(){
        this.htmlTag = '.catList';
        return this.render();
    },
    render: function(){
        var cats = catController.getCats();
        var list = '';
        var cat;
        
        for (var i in cats){
            cat = cats[i];
            var tmp = '<li data-id="'+ i +'">' + cat.name + '</li>';
            list +=tmp;
        }
        $(this.htmlTag).empty();
        $(this.htmlTag).append(list);
        
        $(this.htmlTag).on('click', 'li', function (){
            var id = $(this).attr('data-id');
            var newCat = catController.getCats()[id];
            catController.setCurrentCat(id, newCat);
            
            //re-render cat update view
            catUpdateView.render();
        });
    }
};

var catView = {
    init: function(){
        this.elParent = '.catView';
        this.elName = $(this.elParent + ' .name');
        this.elCounter = $(this.elParent + ' .counter');
        this.elImg = $(this.elParent + ' .img img');
        
        //add click event for image
        $(this.elImg).on('click', this, function(){
            catController.clickCounter();
            //re-render cat update view
            catUpdateView.render();
        });
        
        this.render();
    },
    render: function(){
        $(this.elName).html(catController.getCurrentCat().name);
        $(this.elCounter).html(catController.getCurrentCat().clicks);
        $(this.elImg).attr({
            'src': catController.getCurrentCat().img,
            'alt': catController.getCurrentCat().name
        });
        
    }
};

var catController = {
    init: function(){
        //initializing
        //set first cat from catModel as default
        catModel.currentCat = catModel.cats[this.getFirstCatId()];
        catModel.currentCatdId = this.getFirstCatId();
        catListView.init();
        catView.init();
        catUpdateView.init();
    },
    getCurrentCat: function(){
        return catModel.currentCat;
    },
    getFirstCatId: function(){
        function firstCat (obj) {
            for (var a in obj) return a;
        }
        
        var firstCatId = firstCat(catModel.cats);
        
        return firstCatId;
    },
    setCurrentCat: function(id, cat){
        //update currentCat in catModel and re-render catView
        catModel.currentCat = cat;
        catModel.currentCatdId = id;
        catListView.render();
        catView.render();
    },
    getCurrentCatId: function(){
        return catModel.currentCatdId;
    },
    getCats: function(){
        return catModel.cats;
    },
    clickCounter: function(){
        //update clicks count in catModel and re-render catView
        catModel.currentCat.clicks +=1;
        catView.render();
    },
    saveCat: function(name, img, click){
        var catId = this.getCurrentCatId();
        var updatedCat = new cat(name, img, click);
        this.getCats()[catId] = updatedCat;
        this.setCurrentCat(catId, updatedCat);
    }
};

catController.init();