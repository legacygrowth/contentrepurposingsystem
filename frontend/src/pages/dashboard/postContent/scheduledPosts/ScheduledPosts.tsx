import DataTable from "@/components/dashboard/table/data-table";
import data from "../../../../data.json";

const ScheduledPosts = () => {
  return (
    <>
      <DataTable data={data} />
    </>
  );
};

export default ScheduledPosts;
