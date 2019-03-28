Component({
    properties: {
        tabList: Array,
        currentIndex: {
            type: Number,
            value: 0
        }
    },
    methods: {
        tabChange(e) {
            let { index } = e.currentTarget.dataset;
            if (index == this.data.currentIndex) {
                return;
            }
            this.setData({
                currentIndex: index,
                statusPos: index * this.data.itemWidth + (this.data.itemWidth - this.data.statusWidth) / 2 
            });
            this.triggerEvent("tabchange", index);
        }
    },
    lifetimes: {
        attached() {
            
            
        },
        ready() {
            let that = this;
            let query = wx.createSelectorQuery().in(this);
            query.select(".tab-status").boundingClientRect();
            query.selectAll(".tab-item").boundingClientRect();
            query.exec(rect => {
                console.log(rect);
                that.setData({
                    statusWidth: rect[0].width,
                    itemWidth: rect[1][0].width,
                    statusPos: (rect[1][0].width - rect[0].width) / 2
                });
            });
        }
    }
})
