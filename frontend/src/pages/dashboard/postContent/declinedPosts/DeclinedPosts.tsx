import DataTable from "@/components/dashboard/table/data-table";
import data from "../../../../data.json";

const DeclinedPosts = () => {
  return (
    <>
      <DataTable data={data} />
    </>
  );
};

export default DeclinedPosts;
