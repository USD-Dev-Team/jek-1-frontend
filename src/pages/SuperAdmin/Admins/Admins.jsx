import { Box, Button, CloseButton, Flex, Heading, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { apiUsers } from "../../../Services/api/Users";
import toast from "react-hot-toast";
import { toastService } from "../../../utils/toast";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { Edit2, Trash2 } from "lucide-react";
import { formatDateTime } from "../../../utils/tools/formatDateTime";
import ConfirmDelModal from "../../../components/common/ConfirmDelModal";

export default function Admins() {
    const modal = useDisclosure();
    const delModal = useDisclosure();

    // data states
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false)
    const [form, setForm] = useState({
        full_name: "",
        username: "",
        password: "",
        role: "ADMIN"
    });
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    // FUNCTIONS

    const clearForm = () => {
        setForm({
            full_name: "",
            username: "",
            password: "",
            role: "ADMIN"
        });
    }
    // FETCH ADMINS
    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await apiUsers.getUsersByRole('ADMIN');
            setAdmins(res.data)
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchAdmins();
    }, []);

    // create admin
    const createAdmin = async () => {
        const validation = form.full_name && form.password && form.username;
        if (!validation) {
            toastService.error('Ma\'lumotlar to\'liq emas');
            return;
        };
        setSaving(true);
        try {
            await apiUsers.Add(form);
            modal.onClose();
            fetchAdmins()
        } finally {
            setSaving(false)
        }
    };

    // update Admin
    const updateAdmin = async () => {
        const validation = form.full_name && form.username && editingItem?.id;
        if (!validation) {
            toast.error('Ma\'lumotlar to\'liq bo\'lishi shart');
            return
        };
        setSaving(true);
        const { password, role, ...prev } = form
        try {
            const res = await apiUsers.Update(prev, editingItem?.id);
            modal.onClose();
            fetchAdmins()
        } finally {
            setSaving(false)
        }
    }
    const saveForm = () => {
        if (editingItem) {
            updateAdmin()
        } else {
            createAdmin()
        }
    };
    // delete admin
    const deleteItem = async () => {
        setDeleting(true);
        try {
            await apiUsers.Delete(deletingItem?.id);
            delModal.onClose();
            fetchAdmins();
        } finally {
            setDeleting(false)
        }
    }

    // RENDER
    return (
        <Box py={4} pr={2}>
            {/* HEADER */}
            <Flex mb={12} alignItems={'center'} justifyContent={'space-between'}>
                <Heading size={'md'}>Admins page</Heading>
                <Button
                    onClick={() => {
                        clearForm();
                        modal.onOpen()
                    }}
                    variant={'solidPrimary'}
                >
                    Create Admin
                </Button>
            </Flex>
            {/* MAIN CONTENT */}
            {loading ?
                <Box>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>N</Th>
                                <Th>Fullname</Th>
                                <Th>Username</Th>
                                <Th>Created At</Th>
                                <Th>Last updated</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <TableSkeleton rows={15} columns={6} />
                        </Tbody>
                    </Table>
                </Box> :
                <Box>
                    {admins.length === 0 ?
                        <Box>User mavjud emas</Box> :
                        <Box>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>N</Th>
                                        <Th>Fullname</Th>
                                        <Th>Username</Th>
                                        <Th>Created At</Th>
                                        <Th>Last updated</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {admins?.map((u, index) => {
                                        return (
                                            <Tr>
                                                <Td>{index + 1}</Td>
                                                <Td>{u.full_name}</Td>
                                                <Td>{u.username}</Td>
                                                <Td>{formatDateTime(u.createdAt)}</Td>
                                                <Td>{u.updatedAt}</Td>
                                                <Td>
                                                    <Flex gap={2}>
                                                        <IconButton
                                                            onClick={() => {
                                                                setForm({
                                                                    full_name: u.full_name,
                                                                    username: u.username,
                                                                    password: "",
                                                                    role: "ADMIN"
                                                                });
                                                                modal.onOpen()
                                                                setEditingItem(u)
                                                            }}
                                                            colorScheme="blue"
                                                            icon={<Edit2 />}
                                                        />
                                                        <IconButton
                                                            onClick={() => {
                                                                setDeletingItem(u);
                                                                delModal.onOpen();
                                                            }}
                                                            colorScheme="red"
                                                            icon={<Trash2 />}
                                                        />
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>

                        </Box>
                    }
                </Box>
            }

            {/* FORM MODAL */}
            <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent={'space-between'}>
                            <Text>{editingItem ? "Edit admin" : "Create admin"}</Text>
                            <CloseButton onClick={modal.onClose} />
                        </Flex>
                    </ModalHeader>
                    <ModalBody>
                        <VStack>
                            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Enter Fullname" />
                            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Enter username" />
                            {!editingItem &&
                                <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" />
                            }
                        </VStack>
                    </ModalBody>
                    <ModalFooter gap={'2'}>
                        <Button onClick={modal.onClose} variant={'outlinePrimary'}>
                            Close
                        </Button>
                        <Button
                            onClick={saveForm}
                            variant={'solidPrimary'}
                            isLoading={saving}
                            loadingText="Saving..."
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* DEL CONFIRM MODAL */}
            <ConfirmDelModal
                isOpen={delModal.isOpen}
                onClose={delModal.onClose}
                onConfirm={deleteItem}
                itemName={deletingItem?.full_name}
                loading={deleting}
                typeItem={"Admin"}
            />
        </Box>
    )
}