/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { API } from '../services/API';
import { toast } from 'sonner';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const columns: GridColDef[] = [
    { field: 'image', headerName: 'Image', width: 130, renderCell: (_params) => <div className='flex w-full h-full justify-center items-center'><img className='h-auto w-1/2 rounded-md' src={_params.value} /></div> },
    { field: 'name', editable: true, headerName: 'Nom', width: 130 },
    { field: 'visibility', editable: true, headerName: 'Etat', width: 130, renderCell: (_params) => _params.value ? <div className='w-full h-full bg-green-700 text-green-100 text-center'>Is online</div> : <div className='w-full h-full bg-red-700 text-red-100 text-center'>Is offline</div> },
    {
        field: 'stock',
        headerName: 'Stock',
        type: 'number',
        width: 130,
    },
    {
        field: 'price',
        headerName: 'Price à l\'unité',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (_value, row) => `${row.price || ''} ${row.currency || ''}`,
    },
    {
        field: 'description',
        headerName: 'Description',
        type: 'string',
        width: 130,
    },
    {
        field: "action",
        headerName: "Action",
        width: 180,
        sortable: false,
        renderCell: (_params) => {
            const edit = async () => {

            }
            return (
                <>
                    <div className='w-full h-full flex justify-between'>
                        <button className='bg-blue-600 px-2 mx-2' onClick={edit}>
                            <EditOutlinedIcon className='text-blue-100' />
                        </button>
                        <button className='bg-green-600 px-2 mx-2' onClick={edit}>
                            <RemoveRedEyeOutlinedIcon className='text-green-100' />
                        </button>
                        <button className='bg-red-600 px-2 mx-2' onClick={edit}>
                            <DeleteOutlineOutlinedIcon className='text-red-100' />
                        </button>
                    </div>
                </>
            )
        }
    },
];

export default function DataTable({ categoryId }: { categoryId: string }) {
    console.log(categoryId);

    const [products, setProducts] = React.useState<any[] | undefined>([]);
    const ref = React.useRef(false);
    console.log(ref);


    React.useEffect(() => {
        ref.current = false
        const api: API = new API()
        setProducts([])
        const fetch = async () => {
            try {
                const response = await api.getAllProductByCategoryId(categoryId)
                setProducts(response)
            } catch (error: any) {
                toast.error(error.response.detail)
            }
        }

        if (ref.current === false) {
            fetch()
        }
        return () => {
            ref.current = true;
        }
    }, [categoryId])

    return (
        <div style={{ height: 500, width: '100%', paddingLeft: '8px', paddingRight: '8px' }}>
            <DataGrid
                rows={products}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
}