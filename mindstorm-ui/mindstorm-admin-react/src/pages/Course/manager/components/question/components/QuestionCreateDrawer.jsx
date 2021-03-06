import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FrownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Checkbox,
  Collapse,
  Drawer,
  Form,
  Input,
  message,
  Radio,
  Skeleton,
  Space,
  Tabs,
  Tag,
} from 'antd';
import styles from '@/pages/Course/manager/style.less';
import ProCard from '@ant-design/pro-card';
import { listQuestionTypes } from '@/services/questiontype';
import { Editor } from '@tinymce/tinymce-react';
import TopicForm from '@/pages/Course/manager/components/question/components/TopicForm';
import { uploadQuestionImage } from '@/services/attachment';
import TinyMceModalEditor from '@/components/TinyMceEditor/modal';
import { createQuestion } from '@/services/question';
import { history } from 'umi';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const QuestionCreateDrawer = (props) => {
  const { courseId } = history.location.query;
  const { isDrawerVisible, setDrawerVisible, actionRef, userId, pid } = props;
  const [questionTypes, setQuestionTypes] = useState(undefined);
  const [currentTopics, setCurrentTopics] = useState([]);
  const [currentQuestionType, setCurrentQuestionType] = useState(0);
  const [isTopicFormVisible, setTopicFormVisible] = useState(false);
  const [extraOptions, setExtraOptions] = useState([]);
  const [extraAnswers, setExtraAnswers] = useState([]);
  const [currentInputName, setCurrentInputName] = useState(undefined);
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [isEditorModalVisible, setEditorModalVisible] = useState(false);
  const [currentForm, setCurrentForm] = useState(undefined);
  const editorRef = useRef(null);
  const [optionsForm] = Form.useForm();
  const [answerForm] = Form.useForm();
  const [answerAnalyzeForm] = Form.useForm();
  const answerRadioRef = useRef();
  const [questionVO, setQuestionVO] = useState({
    courseId,
    userId,
    pid,
    questionTypeId: '',
    questionType: 0,
    formatContent: '',
    difficulty: 0,
    isFolder: false,
    options: [],
    answerIndex: [0],
    answers: [],
    answerValue: '',
    answerAnalyze: '',
    topicIds: [],
  });

  const fetchQuestionTypes = async () => {
    const res = await listQuestionTypes();
    if (res.success) {
      setQuestionTypes(res.data.questionTypes);
    }
  };

  useEffect(() => {
    fetchQuestionTypes();
  }, []);

  const extraSlot = {
    left: <Space style={{ marginRight: 20 }}>??????</Space>,
    right: '',
  };

  const position = ['left', 'right'];

  const slot = useMemo(() => {
    if (position.length === 0) return null;

    return position.reduce((acc, direction) => ({ ...acc, [direction]: extraSlot[direction] }), {});
  }, [position]);

  const handleEditorModal = (formType = 0, name = '', value = '') => {
    if (formType === 0) {
      setCurrentForm(optionsForm);
    } else if (formType === 1) {
      setCurrentForm(answerForm);
    } else {
      setCurrentForm(answerAnalyzeForm);
    }
    setCurrentInputName(name);
    setCurrentInputValue(value);
    setEditorModalVisible(true);
  };

  const handleSaveQuestion = async () => {
    if (editorRef?.current.getContent() === '') {
      message.warn('??????????????????');
      return;
    }
    const options = optionsForm.getFieldsValue(true);
    const answers = answerForm.getFieldsValue(true);
    const answerAnalyze = answerAnalyzeForm.getFieldsValue(true);
    questionVO.formatContent = editorRef?.current.getContent();
    questionVO.options = Object.keys(options).map((key) => {
      return {
        optionName: key,
        optionValue: options[key],
      };
    });
    questionVO.answers = Object.keys(answers).map((key) => {
      return {
        value: answers[key],
      };
    });
    if (questionVO.questionTypeId === '') {
      questionVO.questionTypeId = questionTypes[0].id;
    }
    questionVO.questionType = currentQuestionType;
    questionVO.answerAnalyze = answerAnalyze.answerAnalyze;
    questionVO.topicIds = currentTopics.map((item) => item.id);
    console.log(questionVO);

    const hide = message.loading('??????????????????');
    try {
      await createQuestion(questionVO);
      hide();
      message.success(`???????????????`);
      setDrawerVisible(false);
      actionRef.current.reset();
    } catch (error) {
      hide();
      message.error(`????????????????????????`);
    }
  };

  return (
    <Drawer
      destroyOnClose
      getContainer={false}
      className={styles.drawer}
      title={
        <span>
          <FrownOutlined style={{ marginRight: 10 }} />
          ????????????
        </span>
      }
      width="100%"
      height="100%"
      placement="bottom"
      onClose={() => {
        setDrawerVisible(false);
        actionRef?.current.reset();
      }}
      visible={isDrawerVisible}
      footer={
        <Button
          onClick={() => {
            handleSaveQuestion();
          }}
          style={{ float: 'right' }}
          type="primary"
        >
          ????????????
        </Button>
      }
    >
      <div style={{ width: '80%', margin: '0 auto' }}>
        <ProCard>
          {questionTypes === undefined ? (
            <Skeleton active />
          ) : (
            <Tabs
              onTabClick={(key = '') => {
                setCurrentQuestionType(Number(key.substr(key.length - 1)));
                setQuestionVO({ ...questionVO, questionTypeId: key.substr(0, key.indexOf('-')) });
              }}
              defaultActiveKey="1"
              tabBarExtraContent={slot}
            >
              {questionTypes.map((item) => (
                <TabPane tab={item.name} key={`${item.id}-${item.type}`}></TabPane>
              ))}
            </Tabs>
          )}
        </ProCard>
        <Collapse style={{ marginTop: 20 }}>
          <Panel header="??????" key="1">
            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)}
              apiKey="nzmlokkyb5avilcxl9sdfudwrnb818m5ovuc4c7av96gwue9"
              init={{
                language: 'zh_CN',
                min_height: 400,
                plugins:
                  'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave autoresize formatpainter',
                toolbar:
                  'code undo redo restoredraft |' +
                  ' cut copy paste pastetext | ' +
                  'forecolor backcolor bold italic underline strikethrough link anchor |' +
                  ' alignleft aligncenter alignright alignjustify outdent indent |' +
                  ' styleselect formatselect fontselect fontsizeselect |' +
                  ' bullist numlist | blockquote subscript superscript removeformat | ' +
                  'table image media charmap emoticons hr pagebreak insertdatetime print preview | ' +
                  'fullscreen | bdmap indent2em lineheight formatpainter axupimgs',
                fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                images_upload_handler: async (blobInfo, successFun, failFun) => {
                  const file = blobInfo.blob();
                  const formData = new FormData();
                  formData.append('image', file);
                  const res = await uploadQuestionImage(formData);
                  if (res.success) {
                    const { questionAttachment } = res.data;
                    successFun(questionAttachment.path);
                  } else {
                    failFun(res.message);
                  }
                },
              }}
            />
          </Panel>
          {!(currentQuestionType === 0 || currentQuestionType === 1) ? (
            ''
          ) : (
            <Panel header="??????" key="2">
              <Form form={optionsForm} preserve={false} autoComplete="off" labelCol={{ span: 2 }}>
                <Form.Item
                  key="A"
                  label="?????? A"
                  name="A"
                  rules={[{ required: true, message: `?????? A???????????????` }]}
                >
                  <Input
                    onClick={(e) => {
                      handleEditorModal(0, 'A', e.target.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  key="B"
                  label="?????? B"
                  name="B"
                  rules={[{ required: true, message: `?????? B???????????????` }]}
                >
                  <Input
                    onClick={(e) => {
                      handleEditorModal(0, 'B', e.target.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  key="C"
                  label="?????? C"
                  name="C"
                  rules={[{ required: true, message: `?????? C???????????????` }]}
                >
                  <Input
                    onClick={(e) => {
                      handleEditorModal(0, 'C', e.target.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  key="D"
                  label="?????? D"
                  name="D"
                  rules={[{ required: true, message: `?????? D???????????????` }]}
                >
                  <Input
                    onClick={(e) => {
                      handleEditorModal(0, 'D', e.target.value);
                    }}
                  />
                </Form.Item>
                {extraOptions.map((item) => {
                  return (
                    <Form.Item
                      key={item.name}
                      label={`?????? ${item.name}`}
                      name={item.name}
                      rules={[{ required: true, message: `?????? ${item.name}???????????????` }]}
                    >
                      <Input
                        onClick={(e) => {
                          handleEditorModal(0, item.name, e.target.value);
                        }}
                        addonAfter={
                          <MinusCircleOutlined
                            onClick={() => {
                              const newExtraOptions = extraOptions
                                .filter((option) => option.name !== item.name)
                                .map((option, index) => {
                                  return {
                                    name: String.fromCharCode(index + 69),
                                    value: index + 4,
                                  };
                                });
                              setExtraOptions(newExtraOptions);
                            }}
                          />
                        }
                      />
                    </Form.Item>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setExtraOptions([
                        ...extraOptions,
                        {
                          name: String.fromCharCode(extraOptions.length + 69),
                          value: extraOptions.length + 4,
                        },
                      ]);
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    ????????????
                  </Button>
                </Form.Item>
              </Form>
            </Panel>
          )}
          <Panel header="???????????????" key="3">
            <div>
              ?????????
              {currentQuestionType === 0 && (
                <Radio.Group
                  onChange={(e) => {
                    setQuestionVO({ ...questionVO, answerIndex: [e.target.value] });
                  }}
                  defaultValue={questionVO.answerIndex[0]}
                  ref={answerRadioRef}
                >
                  <Radio value={0}>A</Radio>
                  <Radio value={1}>B</Radio>
                  <Radio value={2}>C</Radio>
                  <Radio value={3}>D</Radio>
                  {extraOptions.map((item) => (
                    <Radio key={item.value + item.name} value={item.value}>
                      {item.name}
                    </Radio>
                  ))}
                </Radio.Group>
              )}
              {currentQuestionType === 1 && (
                <Checkbox.Group
                  defaultValue={questionVO.answerIndex}
                  onChange={(checkedValue) =>
                    setQuestionVO({ ...questionVO, answerIndex: checkedValue })
                  }
                >
                  <Checkbox value={0}>A</Checkbox>
                  <Checkbox value={1}>B</Checkbox>
                  <Checkbox value={2}>C</Checkbox>
                  <Checkbox value={3}>D</Checkbox>
                  {extraOptions.map((item) => (
                    <Checkbox key={item.value + item.name} value={item.value}>
                      {item.name}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}
              {currentQuestionType === 3 && (
                <Radio.Group
                  onChange={(e) => {
                    setQuestionVO({ ...questionVO, answerValue: e.target.value });
                  }}
                  defaultValue={questionVO.answerValue}
                >
                  <Radio value={1}>??????</Radio>
                  <Radio value={0}>??????</Radio>
                </Radio.Group>
              )}
              {currentQuestionType === 2 && [
                <Form
                  form={answerForm}
                  key="fillAnswerForm"
                  preserve={false}
                  autoComplete="off"
                  labelCol={{ span: 2 }}
                >
                  <Form.Item
                    key="answer1"
                    label="???1?????????"
                    name="answer1"
                    rules={[{ required: true, message: `???1????????????????????????` }]}
                  >
                    <Input
                      onClick={(e) => {
                        handleEditorModal(1, 'answer1', e.target.value);
                      }}
                    />
                  </Form.Item>
                  {extraAnswers.map((item) => {
                    return (
                      <Form.Item
                        key={item.name}
                        label={`???${item.value}?????????`}
                        name={item.name}
                        rules={[{ required: true, message: `???${item.value}????????????????????????` }]}
                      >
                        <Input
                          onClick={(e) => {
                            handleEditorModal(1, item.name, e.target.value);
                          }}
                          addonAfter={
                            <MinusCircleOutlined
                              onClick={() => {
                                const newExtraAnswers = extraAnswers
                                  .filter((answer) => answer.name !== item.name)
                                  .map((answer, index) => {
                                    return {
                                      name: `answer${index + 2}`,
                                      value: index + 2,
                                    };
                                  });
                                setExtraAnswers(newExtraAnswers);
                              }}
                            />
                          }
                        />
                      </Form.Item>
                    );
                  })}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        setExtraAnswers([
                          ...extraAnswers,
                          {
                            name: `answer${extraAnswers.length + 2}`,
                            value: extraAnswers.length + 2,
                          },
                        ]);
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      ????????????
                    </Button>
                  </Form.Item>
                </Form>,
                <Alert
                  key="tips"
                  message="??????"
                  description={
                    <div>
                      <div>1????????????????????????????????????????????????????????????????????????;????????????????????????H2O</div>
                      <div>
                        2????????????????????????????????????????????????????????????????????????????????????????????????-?????????1-9,????????????1???9????????????????????????????????????1???9???
                      </div>
                    </div>
                  }
                  type="info"
                  showIcon
                />,
              ]}
              {currentQuestionType === 4 && (
                <div style={{ marginTop: 10 }}>
                  <Editor
                    onEditorChange={(value, _) =>
                      setQuestionVO({ ...questionVO, answerValue: value })
                    }
                    apiKey="nzmlokkyb5avilcxl9sdfudwrnb818m5ovuc4c7av96gwue9"
                    init={{
                      language: 'zh_CN',
                      min_height: 400,
                      plugins:
                        'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave autoresize formatpainter',
                      toolbar:
                        'code undo redo restoredraft |' +
                        ' cut copy paste pastetext | ' +
                        'forecolor backcolor bold italic underline strikethrough link anchor |' +
                        ' alignleft aligncenter alignright alignjustify outdent indent |' +
                        ' styleselect formatselect fontselect fontsizeselect |' +
                        ' bullist numlist | blockquote subscript superscript removeformat | ' +
                        'table image media charmap emoticons hr pagebreak insertdatetime print preview | ' +
                        'fullscreen | bdmap indent2em lineheight formatpainter axupimgs',
                      fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                      images_upload_handler: async (blobInfo, successFun, failFun) => {
                        const file = blobInfo.blob();
                        const formData = new FormData();
                        formData.append('image', file);
                        const res = await uploadQuestionImage(formData);
                        if (res.success) {
                          const { questionAttachment } = res.data;
                          successFun(questionAttachment.path);
                        } else {
                          failFun(res.message);
                        }
                      },
                    }}
                  />
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <Form
                  form={answerAnalyzeForm}
                  key="answerAnalyze"
                  preserve={false}
                  autoComplete="off"
                  labelCol={{ span: 2 }}
                >
                  <Form.Item
                    label="????????????"
                    name="answerAnalyze"
                    rules={[{ required: true, message: `???????????????????????????` }]}
                  >
                    <Input
                      value={questionVO.answerAnalyze}
                      onClick={(e) => {
                        handleEditorModal(2, 'answerAnalyze', e.target.value);
                      }}
                    />
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Panel>
          <Panel header="??????????????????" key="4">
            <Space direction="vertical">
              <Space>
                ???????????????
                <Radio.Group
                  defaultValue={questionVO.difficulty}
                  onChange={(e) => {
                    setQuestionVO({ ...questionVO, difficulty: e.target.value });
                  }}
                >
                  <Radio value={0}>??????</Radio>
                  <Radio value={1}>??????</Radio>
                  <Radio value={2}>??????</Radio>
                </Radio.Group>
              </Space>
              <Space>
                ????????????
                <Button
                  onClick={() => {
                    setTopicFormVisible(true);
                  }}
                  type="link"
                  icon={<PlusOutlined />}
                >
                  ???????????????
                </Button>
                {currentTopics === []
                  ? ''
                  : currentTopics.map((item) => (
                      <Space key={item.id}>
                        <Tag
                          closable
                          onClose={() =>
                            setCurrentTopics([...currentTopics.filter((v) => v.id !== item.id)])
                          }
                          color="magenta"
                        >
                          {item.name}
                        </Tag>
                      </Space>
                    ))}
                {!isTopicFormVisible ? (
                  ''
                ) : (
                  <TopicForm
                    isModalVisible={isTopicFormVisible}
                    setModalVisible={setTopicFormVisible}
                    currentTopics={currentTopics}
                    setCurrentTopics={setCurrentTopics}
                  />
                )}
              </Space>
            </Space>
          </Panel>
        </Collapse>
        {!isEditorModalVisible ? (
          ''
        ) : (
          <TinyMceModalEditor
            isModalVisible={isEditorModalVisible}
            setModalVisible={setEditorModalVisible}
            targetInputName={currentInputName}
            currentForm={currentForm}
            currentValue={currentInputValue}
          />
        )}
      </div>
    </Drawer>
  );
};

export default QuestionCreateDrawer;
