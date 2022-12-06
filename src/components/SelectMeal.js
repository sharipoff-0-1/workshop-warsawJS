import * as React from "react";
import { Divider, Loader } from "semantic-ui-react";
import { useQuery } from "react-query";
import Filters from "./Filters";
import MealList from "./MealList";
import ChartToggler from "./ChartToggler";
import * as utils from "../commons/utils";
import { FILTER_OPTIONS } from "../commons/const";
import axios from "axios";
const RatingChart = lazyWithPreload(() => import("./RatingChart"));

const SelectMeal = (props) => {
  const [chartVisible, setChartVisible] = React.useState(false);
  const [filters, setFilters] = React.useState({});

  const [isPending, setTransition] = React.useTransition();

  const onChangeFilters = React.useCallback(
    (filterId, isSelected) =>
      setTransition(() =>
        setFilters((state) => ({
          ...state,
          [filterId]: isSelected,
        }))
      ),
    []
  );

  const { isLoading, data = [] } = useQuery("repoData", () =>
    axios("/api/meals").then(({ data }) => {
      RatingChart.preload();
      return data;
    })
  );

  const count = React.useMemo(() => utils.countMealsByBedType(data), [data]);
  // const filteredData = utils.applyFilter(filters, data);

  const filteredData = React.useMemo(
    () => utils.applyFilter(filters, data),
    [data, filters]
  );

  const isToggle = () => {
    setChartVisible(!chartVisible);
  };

  return (
    <React.Fragment>
      <ChartToggler isVisible={chartVisible} onChange={isToggle} />
      <Divider hidden />
      <React.Suspense fallback={<span>ładowanie</span>}>
        {chartVisible && <RatingChart data={filteredData} />}
      </React.Suspense>
      <Divider />
      <Filters
        options={FILTER_OPTIONS}
        onChange={onChangeFilters}
        count={count}
      />
      {isPending && <Loader active size="mini" inline />}
      <Divider />
      {isLoading ? "Loading..." : <MealList meals={filteredData} />}
      <Divider hidden></Divider>
    </React.Fragment>
  );
};

export default SelectMeal;

function lazyWithPreload(factory) {
  const Component = React.lazy(factory);
  Component.preload = factory;
  return Component;
}
