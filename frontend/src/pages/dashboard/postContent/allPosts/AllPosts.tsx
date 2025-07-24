import data from "../../../../data.json";
import DataTable from "@/components/dashboard/table/data-table";

const AllPosts = () => {
  return (
    <>
      <DataTable data={data} />
    </>
  );
};

export default AllPosts;
