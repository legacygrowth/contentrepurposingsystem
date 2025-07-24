import DataTable from "@/components/dashboard/table/data-table";
import data from "../../../../data.json";

const DeletedPosts = () => {
  return (
    <>
      <DataTable data={data} />
    </>
  );
};

export default DeletedPosts;
