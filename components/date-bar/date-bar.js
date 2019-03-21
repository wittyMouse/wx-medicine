import { getFormatDate } from '../../utils/util';

Component({
  properties: {
    currentWeek: {
      type: Number,
      value: 0
    },
    currentDate: {
      type: Number,
      value: 0
    }
  },
  data: {
    weekList: ['日', '一', '二', '三', '四', '五', '六']
  },
  methods: {
    /**
     * 切换星期
     * @param {*} e 
     */
    weekChange(e) {
      let { tag } = e.currentTarget.dataset,
        week = this.data.currentWeek;
      if (tag == 'next' && week < 2) {
        week += 1;
      } else if (tag == 'last' && week > 0) {
        week -= 1;
      } else {
        return;
      }
      this.dateInit(week);
      this.setData({
        currentWeek: week
      });
      let data = {
        currentWeek: this.data.currentWeek,
        currentDate: this.data.currentDate,
        fullDate: this.data.dateList[this.data.currentDate].fullDate
      };
      this.triggerEvent('change', data);
    },

    /**
     * 切换日期
     * @param {*} e 
     */
    dateChange(e) {
      let { index } = e.currentTarget.dataset;
      if (index == this.data.currentDate) {
        return;
      }
      this.setData({
        currentDate: index
      });
      let data = {
        currentWeek: this.data.currentWeek,
        currentDate: this.data.currentDate,
        fullDate: this.data.dateList[index].fullDate
      }
      this.triggerEvent('change', data);
    },

    /**
     * 日期初始化
     * @param {*} week 
     */
    dateInit(week = 0) {
      const size = 7;
      const date = new Date();
      let dateList = [];

      date.setDate(date.getDate() + week * size);

      for (let i = 0; i < size; i++) {
        if (i != 0) {
          date.setDate(date.getDate() + 1);
        }
        dateList.push({ fullDate: getFormatDate(date, "yyyy-MM-dd"), date: getFormatDate(date, "MM-dd"), day: date.getDay() });
      }

      this.setData({
        dateList
      });
    },
  },
  lifetimes: {
    attached() {
      this.dateInit();
    }
  }
})