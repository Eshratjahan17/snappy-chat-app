import { Avatar, Box, Button, Center, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loadingChat, setLoadingChat] = useState(false);

   const {
     setSelectedChat,
     user,
     notification,
     setNotification,
     chats,
     setChats,
   } = ChatState();

   const toast = useToast();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const navigate = useNavigate();

   const logoutHandler = () => {
     localStorage.removeItem("userInfo");
     navigate("/");
   };

   const handleSearch = async () => {
     if (!search) {
       toast({
         title: "Please Enter something in search",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "top-left",
       });
       return;
     }

     try {
       setLoading(true);

       const config = {
         headers: {
           Authorization: `Bearer ${user.token}`,
         },
       };

       const { data } = await axios.get(`/api/user?search=${search}`, config);

       setLoading(false);
       setSearchResult(data);
     } catch (error) {
       toast({
         title: "Error Occured!",
         description: "Failed to Load the Search Results",
         status: "error",
         duration: 5000,
         isClosable: true,
         position: "bottom-left",
       });
     }
   };

   const accessChat = async (userId) => {
     console.log(userId);

     try {
       setLoadingChat(true);
       const config = {
         headers: {
           "Content-type": "application/json",
           Authorization: `Bearer ${user.token}`,
         },
       };
       const { data } = await axios.post(`/api/chat`, { userId }, config);

       if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
       setSelectedChat(data);
       setLoadingChat(false);
       onClose();
     } catch (error) {
       toast({
         title: "Error fetching the chat",
         description: error.message,
         status: "error",
         duration: 5000,
         isClosable: true,
         position: "bottom-left",
       });
     }
   };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text>
          <Center fontSize="2xl" fontFamily="Work sans">
            Snappy Chat APP
          </Center>
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                  clipRule="evenodd"
                />
              </svg>
            </MenuButton>
            {/* <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" 
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {/* {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )} */}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;