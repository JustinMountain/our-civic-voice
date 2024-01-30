import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import { REST_API_URL } from "@/config/constants";

export default async function Page({ params }: { params: { slug: string } }) {

  const slug = { params }.params.slug;

  const data = await getData('', slug)

  return (
    <div className="container mx-auto py-10">
      {data.length} Test
    </div>
  )
}

export async function getData(route: string, constituency: string): Promise<any> {


  const url = `${REST_API_URL}/representatives/${route}${constituency}`;
  console.log(url);

  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (error) {
    // console.error(`Could not GET from ${REST_API_URL}/${path}`);
    throw error; 
  }
}
