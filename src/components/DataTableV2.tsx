/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlots,
} from '@mui/x-data-grid';
import { API } from '../services/API';
import { randomId } from '@mui/x-data-grid-generator';
import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import { toast } from 'sonner';

let IS_SAVE_MODE = false;
let CATEGORYID = '';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    const id = randomId()
    const handleClick = () => {
        IS_SAVE_MODE = true;
        setRows((oldRows) => [...oldRows, {
            category_id: CATEGORYID, // TODO : change this later
            currency: "FCFA",
            description: "",
            id: id,
            image: "",
            name: "",
            price: 0,
            stock: 0,
            visibility: false,
            isNew: true
        }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Ajouter
            </Button>
        </GridToolbarContainer>
    );
}

export default function FullFeaturedCrudGrid({ categoryId }: { categoryId: string }) {
    CATEGORYID = categoryId

    const [rows, setRows] = React.useState<any[]>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const ref = React.useRef(false)

    React.useEffect(() => {
        ref.current = false
        setRows([])
        const api: API = new API()
        const fetch = async () => {
            let response: any = await api.getAllProductByCategoryId(categoryId)
            response = response.filter((product: any) => ((product.created_by == API.userId) || (product.visibility == true)))

            setRows(response ? response : [])
        }

        if (ref.current === false) {
            fetch()
        }
        return () => {
            ref.current = true
        }


    }, [categoryId])

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };
    // ICI pour le button edit
    const handleEditClick = (id: GridRowId) => () => {
        IS_SAVE_MODE = false;
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    // ICI pour le button save
    const handleSaveClick = (id: GridRowId) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
    // ICI pour delete
    const handleDeleteClick = (id: GridRowId) => async () => {
        const row = rows.find((value) => value.id === id)
        const api: API = new API()
        if (row) {
            await api.delete(row.id)
            toast.success('Suppression effectuée avec succès')
        }
        else {
            toast.error('Suppression échoué')
        }

        setRows(rows.filter((row: any) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        /* console.log('CANCELLED'); */

        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row: any) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row: any) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        const api: API = new API()
        const updatedRow: any = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        const formData = new FormData();
        formData.append('product_id ', updatedRow.id);
        formData.append('name', updatedRow.name);
        formData.append('description', updatedRow.description);
        formData.append('price', updatedRow.price);
        formData.append('stock', updatedRow.stock);
        formData.append('category_id', updatedRow.category_id);
        formData.append('currency', updatedRow.currency);



        if (file) {
            formData.append('file', file, file.name);
            if (IS_SAVE_MODE) {
                await api.createProduct(formData)
                toast.success('Enregistrement effectué avec succès')
            } else {

                await api.updateProduct(formData)
                toast.success('Mise à jour effectuée avec succès')
            }
            setFile(null)
        } else {

            if (!IS_SAVE_MODE) {
                const ResponseImage = await fetch(updatedRow.image)
                const blob = await ResponseImage.blob()

                formData.append('file', blob);
                formData.append('product_id ', updatedRow.id);
                await api.updateProduct(formData)
            } else {
                toast.error("Veuillez modifier ou ajouter l'image")
            }
        }


        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const [open, setOpen] = React.useState(false);
    const [file, setFile] = React.useState<any>(null)
    const columns: GridColDef[] = [
        {
            field: 'image',
            headerName: 'Image',
            type: 'string',
            width: 100,
            align: 'left',
            headerAlign: 'left',
            editable: false,
            renderCell: (_params) => <img onDoubleClick={() => {
                setOpen(true);
            }} className='px-2 my-1 h-10' src={_params.value} alt="Une image" />
        },

        {
            field: 'name',
            headerName: 'Nom',
            width: 180,
            editable: true
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 180,
            editable: true,
            type: 'string',
        },

        {
            field: 'price',
            headerName: 'Prix à l\'unité',
            type: 'number',
            align: 'left',
            headerAlign: 'left',
            width: 180,
            editable: true,
            renderCell: (_params: any) => {
                return `${_params.row.price} ${_params.row.currency}`
            }
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number',
            align: 'left',
            headerAlign: 'left',
            width: 180,
            editable: true,
        },
        {
            field: 'visibility',
            headerName: 'Visibilité',
            type: 'boolean',
            align: 'left',
            headerAlign: 'left',
            width: 180,
            editable: false,
            renderCell: (_params: any) => {
                if (_params.row.visibility) {
                    return <span className='py-2 text-green-600 inline-block w-full text-start' >Actif</span>
                }
                return <span className='py-2 text-red-600 inline-block w-full text-start' >Inactif</span>
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }
                const returnList = [

                ];
                if (row.created_by == API.userId) {
                    returnList.push(
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(id)}
                            color="inherit"
                        />
                    )
                    returnList.push(
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={handleDeleteClick(id)}
                            color="inherit"
                        />
                    )
                }

                return returnList
            },
        },
    ];

    const [search, setSearch] = React.useState('')
    const onChanged = (event: any) => {
        setSearch(event.target.value)
    }

    const onClicked = async () => {
        const api: API = new API()
        const response: any = await api.search(search)
        setRows(response)

    }
    return (
        <>
            <form className='w-full flex mb-2 mx-2'>
                <input onChange={onChanged} value={search} type="text" className='w-full py-3 my-2 rounded-sm border border-gray-300 px-3 text-sm focus:outline-none' placeholder='Rechercher...' name="" id="" />
                <button type='button' onClick={onClicked} className='border rounded-sm ml-2 px-2 my-2'>
                    <SearchIcon />
                </button>
            </form>
            <Box
                sx={{
                    height: 550,
                    width: '100%',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    '& .actions': {
                        color: 'text.secondary',
                    },
                    '& .textPrimary': {
                        color: 'text.primary',
                    },
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar as GridSlots['toolbar'],
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                />
                <DialogComponent file={file} setFile={setFile} setOpen={setOpen} open={open} />
            </Box>
        </>
    );
}

function DialogComponent({ setOpen, setFile, open, file }: { setOpen: any, setFile: any, open: any, file: any }) {

    const handleChange = (newFile: any) => {
        /* console.log(newFile); */

        setFile(newFile)
    }
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {"Modification de l'image"}
            </DialogTitle>
            <DialogContent>
                <MuiFileInput InputProps={{
                    inputProps: {
                        accept: 'image/*'
                    },
                    startAdornment: <AttachFileIcon />
                }} placeholder='Choisir une image' value={file} onChange={handleChange} />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Fermer
                </Button>
                <Button onClick={handleClose} autoFocus>
                    Modifier
                </Button>
            </DialogActions>
        </Dialog>
    )
}