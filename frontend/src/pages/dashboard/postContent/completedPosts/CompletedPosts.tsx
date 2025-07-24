import DataTable from "@/components/dashboard/table/data-table";
import data from "../../../../data.json";
const CompletedPosts = () => {
  return (
    <>
      <DataTable data={data} />
    </>
  );
};

export default CompletedPosts;
