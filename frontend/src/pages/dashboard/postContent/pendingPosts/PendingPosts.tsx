import DataTable from "@/components/dashboard/table/data-table";
import data from "../../../../data.json";
const PendingPosts = () => {
  return (
    <div>
      <DataTable data={data} />
    </div>
  );
};

export default PendingPosts;
