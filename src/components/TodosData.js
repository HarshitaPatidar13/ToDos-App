import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { format } from 'date-fns';
import { HiEye } from 'react-icons/hi';
import { MdModeEdit, MdDelete } from 'react-icons/md';

function TodosData() {
  const [todo, setTodo] = useState('');
  const [tasks, setTasks] = useState([]);
  const [entry, setEntry] = useState([]);
  const [show, setShow] = useState(false);
  const [showedit, setShowedit] = useState(false);
  const [showview, setShowview] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShut = () => setShowedit(false);
  const handleOpen = () => setShowedit(true);

  const handleHide = () => setShowview(false);
  const handleView = () => setShowview(true);

  const addTask = async () => {
    const data = {
      todoName: todo,
      completed: false,
    };
    if (todo) {
      try {
        const result = await axios.post(
          'https://64246c169e0a30d92b1b90c8.mockapi.io/api/v1/todos',
          data
        );
        console.log(result.data);
        getTasks();
        setTodo('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const result = await axios.get(
        'https://64246c169e0a30d92b1b90c8.mockapi.io/api/v1/todos'
      );
      console.log(result.data);
      setTasks(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadEditTask = async (id) => {
    try {
      const result = await axios.get(
        `https://64246c169e0a30d92b1b90c8.mockapi.io/api/v1/todos/${id}`
      );
      console.log(result.data);
      setEntry(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id) => {
    try {
      const result = await axios.put(
        `https://64246c169e0a30d92b1b90c8.mockapi.io/api/v1/todos/${id}`,
        entry
      );
      console.log(result.data);
      getTasks();
      setEntry('');
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `https://64246c169e0a30d92b1b90c8.mockapi.io/api/v1/todos/${id}`
      );
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <Button
        className="addButton mx-4 my-4"
        variant="primary"
        onClick={handleShow}
      >
        Add Todos:
      </Button>

      <Modal show={show} onHide={handleClose}>
        <div className="container">
          <input
            className="textArea my-5"
            type="text"
            placeholder="Enter Name"
            value={todo.todoName}
            onChange={(e) => {
              setTodo(e.target.value);
            }}
          />
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addTask();
              handleClose();
            }}
          >
            Save Input
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="tableContainer">
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>TodoName</th>
              <th>CreatedAt</th>
              <th>Completed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((val) => {
              return (
                <tr>
                  <td>{val.id}</td>
                  <td>{val.todoName}</td>
                  <td>{format(new Date(val.createdAt), 'yyyy-MM-dd')}</td>
                  <td>
                    <input type="checkbox" checked={val.completed} />
                  </td>

                  <td>
                    <HiEye
                      color="blue"
                      onClick={() => {
                        loadEditTask(val.id);
                        handleView();
                      }}
                    ></HiEye>
                    <Modal show={showview} onHide={handleHide}>
                      <div className="container my-5">
                        <ul>
                          <li>id:{entry.id}</li>
                          <li>todoName:{entry.todoName}</li>
                          <li>
                            createdAt:
                            {entry.createdAt}
                          </li>
                          <li>completed:{entry.completed ? 'yes' : 'no'}</li>
                        </ul>
                      </div>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleHide}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <MdModeEdit
                      className="mx-4"
                      color="green"
                      onClick={() => {
                        loadEditTask(val.id);
                        handleOpen();
                      }}
                    ></MdModeEdit>
                    <Modal show={showedit} onHide={handleShut}>
                      <div className="container">
                        <input
                          className="my-3"
                          type="text"
                          value={entry.todoName}
                          onChange={(e) =>
                            setEntry({ ...entry, todoName: e.target.value })
                          }
                        />
                        <input
                          className="mx-4"
                          type="checkbox"
                          checked={entry.completed}
                          onChange={(e) =>
                            setEntry({ ...entry, completed: e.target.value })
                          }
                        />
                      </div>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleShut}>
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            updateTask(entry.id);
                            handleShut();
                          }}
                        >
                          Update
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <MdDelete
                      color="red"
                      onClick={() => {
                        deleteTask(val.id);
                      }}
                    ></MdDelete>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default TodosData;
