import DataTable from "@/components/dashboard/table/data-table";
import data from "../../../../data.json";

const MaybeLaterPosts = () => {
  return (
    <>
      <DataTable data={data} />
    </>
  );
};

export default MaybeLaterPosts;
