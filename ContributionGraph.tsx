import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS, SIZES } from '@constants/core/theme';
import AppText from '@components/AppText';
import dayjs from 'dayjs';

type ContributionGraphProps = {
  heatmapvalues: any[];
};

const ContributionGraph = ({ heatmapvalues }: ContributionGraphProps) => {
  const [monthdata, setmonthdata] = useState<any>([]);
  const [heatmapDates, setheatmapDates] = useState<any>([]);
  const [heatmapCounts, setheatmapCounts] = useState<any>([]);
  const [isLoading, setloading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState<any>(2);

  const handleScroll = (direction = 'end') => {
    if (direction === 'start') {
      scrollViewRef?.current?.scrollTo({ x: 0, animated: true });
    } else {
      setTimeout(() => {
        scrollViewRef?.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };
  const MONTH_LABELS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  useEffect(() => {
    console.log(heatmapvalues);
    const dates: any = [];
    const counts: any = [];
    heatmapvalues?.map((value: any) => {
      dates.push(value.date);
      counts.push(value.count);
    });
    setheatmapCounts(counts);
    setheatmapDates(dates);
    setdates();
  }, []);

  const setdates = () => {
    const currentmonth = dayjs().month();
    let currentYearMonths = [];
    const prevYearMonths = [];
    const monthList: any = [];
    let monthNo = currentmonth;
    while (monthNo >= 0) {
      currentYearMonths.push(monthNo);
      monthNo--;
    }
    monthNo = currentmonth + 1;
    for (let i = monthNo; i < 12; i++) {
      prevYearMonths.push(i);
    }
    currentYearMonths = currentYearMonths.sort();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const currentYear = dayjs().year();
    prevYearMonths.map((month) => {
      const start = dayjs()
        .year(currentYear - 1)
        .month(month)
        .startOf('month');
      const end = dayjs()
        .year(currentYear - 1)
        .month(month)
        .endOf('month');
      monthList.push({
        startDate: start,
        endDate: end,
        name: monthNames[month],
        year: currentYear - 1,
        index: month,
      });
    });
    currentYearMonths.map((month) => {
      const end = dayjs().year(currentYear).month(month).endOf('month');
      const start = dayjs().year(currentYear).month(month).startOf('month');
      monthList.push({
        startDate: start,
        endDate: end,
        name: monthNames[month],
        year: currentYear,
        index: month,
      });
    });
    computeMonths(monthList);
    setloading(false);
    handleScroll();
  };

  const colorArray = [
    COLORS.positive200,
    COLORS.positive500,
    COLORS.positive900,
    COLORS.positive900,
  ];

  const computeMonths = (monthList: any) => {
    const list = monthdata;
    monthList.map((month: any) => {
      list.push(computeDays(month.startDate, month.endDate));
    });
    setmonthdata(list);
  };
  const computeDays = (startDate: any, endDate: any) => {
    let date = startDate;
    const days = [];
    while (date <= endDate) {
      days.push(date);
      date = date.add(1, 'day');
    }
    return days;
  };

  const checkSquareColor = (day: any) => {
    day = day.format('YYYY-MM-DD');
    if (heatmapDates.includes(day)) {
      const count = heatmapCounts[heatmapDates.indexOf(day)];
      if (count <= 1) {
        return colorArray[0];
      } else if (count <= 2) {
        return colorArray[1];
      } else if (count <= 3) {
        return colorArray[2];
      } else if (count > 3) {
        return colorArray[3];
      }
    }
    return COLORS.grey50;
  };

  const checkFirstDay = (day: any) => {
    const weekday = day.get('day');
    const list = [];
    for (let i = 0; i < weekday; i++) {
      list.push(i);
    }
    return list;
  };

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          flexDirection: 'row',
        }}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          heatmapvalues && (
            <View style={{ marginTop: SIZES.extraLarge }}>
              <View style={{ flexDirection: 'row' }}>
                {monthdata &&
                  monthdata.map((month: any) => {
                    let monthIndex: number = 0;
                    return (
                      <View key={month} style={{ flexDirection: 'column' }}>
                        <View
                          style={{
                            position: 'relative',
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                            height: 90,
                            marginRight: SIZES.base - 2,
                          }}
                        >
                          {checkFirstDay(month[0]).map((day: any) => {
                            return (
                              <Pressable
                                key={day}
                                style={{
                                  height: SIZES.base,
                                  width: SIZES.base,
                                  backgroundColor: COLORS.white,
                                  borderRadius: SIZES.base / 4,
                                  margin: 2,
                                }}
                              />
                            );
                          })}
                          {month.map((day: any) => {
                            monthIndex = day.get('month');
                            return (
                              <Pressable
                                key={day}
                                style={{
                                  height: SIZES.base,
                                  width: SIZES.base,
                                  backgroundColor: checkSquareColor(day),
                                  borderRadius: SIZES.base / 4,
                                  margin: 2,
                                }}
                                // onPress={() => console.log(day.get('month'), day)}
                              />
                            );
                          })}
                        </View>
                        <AppText
                          size="caption_2"
                          style={{ marginLeft: SIZES.medium }}
                          color={COLORS.grey400}
                        >
                          {MONTH_LABELS[monthIndex]}
                        </AppText>
                      </View>
                    );
                  })}
              </View>
            </View>
          )
        )}
      </ScrollView>
      <View
        style={{
          position: 'relative',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: SIZES.small,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SIZES.base * 3,
          }}
        >
          {[1, 2].map((item) => (
            <Pressable
              key={item}
              style={{
                width: SIZES.small * 3,
                backgroundColor:
                  selectedIndex === item ? COLORS.grey900 : COLORS.grey200,
                height: selectedIndex === item ? SIZES.base - 2 : 2,
                borderRadius: 10,
              }}
              onPress={() => {
                setSelectedIndex(item);
                handleScroll(item === 1 ? 'start' : 'end');
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ContributionGraph;

const styles = StyleSheet.create({});
