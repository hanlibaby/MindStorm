import React, { useEffect, useRef, useState } from 'react';
import { FrownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Drawer,
  message,
  Skeleton,
  Space,
  Collapse,
  Radio,
  Button,
  Tag,
  Form,
  Input,
  Checkbox,
  Alert,
} from 'antd';
import styles from '@/pages/Course/manager/style.less';
import { Editor } from '@tinymce/tinymce-react';
import TopicForm from '@/pages/Course/manager/components/question/components/TopicForm';
import { uploadQuestionImage } from '@/services/attachment';
import TinyMceModalEditor from '@/components/TinyMceEditor/modal';
import { infoQuestion, updateQuestion } from '@/services/question';

const { Panel } = Collapse;

const QuestionCreateDrawer = (props) => {
  const { isDrawerVisible, setDrawerVisible, actionRef, questionId } = props;
  const [currentTopics, setCurrentTopics] = useState([]);
  const [isTopicFormVisible, setTopicFormVisible] = useState(false);
  const [currentInputName, setCurrentInputName] = useState(undefined);
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [isEditorModalVisible, setEditorModalVisible] = useState(false);
  const [currentForm, setCurrentForm] = useState(undefined);
  const [optionInitialValue, setOptionInitialValue] = useState({});
  const [answerInitialValue, setAnswerInitialValue] = useState({});
  const editorRef = useRef(null);
  const [optionsForm] = Form.useForm();
  const [answerForm] = Form.useForm();
  const [answerAnalyzeForm] = Form.useForm();
  const [question, setQuestion] = useState(undefined);

  useEffect(() => {
    async function fetchQuestion() {
      if (questionId !== undefined) {
        const res = await infoQuestion(questionId);
        if (res.success) {
          console.log(res.data.question);
          const { options = [], answers = [] } = res.data.question;
          const optionValues = {};
          options.forEach((item) => {
            optionValues[item.name] = item.value;
          });
          if (answers.length > 0) {
            const answerValues = {};
            answers.forEach((item, index) => {
              answerValues[`answer${index + 1}`] = item.value;
            });
            setAnswerInitialValue(answerValues);
          }
          setOptionInitialValue(optionValues);
          setQuestion(res.data.question);
          setCurrentTopics(res.data.question.topics);
        }
      }
    }
    fetchQuestion();
  }, [questionId]);

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
    const optionsFormValues = optionsForm.getFieldsValue(true);
    const answersFormValues = answerForm.getFieldsValue(true);
    const answerAnalyze = answerAnalyzeForm.getFieldsValue(true);
    const formatContent = editorRef?.current.getContent();
    const options = question.options.map((item) => {
      return {
        optionName: item.name,
        optionValue: optionsFormValues[item.name],
      };
    });
    const answers = question.answers.map((item) => {
      return {
        value: item.value,
      };
    });
    const topicIds = currentTopics.map((item) => item.id);
    const answerIndex = question.answerIndex && question.answerIndex.sort((a, b) => a - b);
    const questionVO = {
      ...question,
      answers,
      answerIndex,
      formatContent,
      options,
      topicIds,
      answerAnalyze: answerAnalyze.answerAnalyze,
    };
    console.log(questionVO, answersFormValues, answers);

    const hide = message.loading('??????????????????');
    try {
      await updateQuestion(questionVO);
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
        {question === undefined ? (
          <Skeleton active />
        ) : (
          <Collapse style={{ marginTop: 20 }}>
            <Panel header="??????" key="1">
              <Editor
                initialValue={question.formatContent}
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
            {!(question.questionType === 0 || question.questionType === 1) ? (
              ''
            ) : (
              <Panel header="??????" key="2">
                <Form
                  initialValues={optionInitialValue}
                  form={optionsForm}
                  preserve={false}
                  autoComplete="off"
                  labelCol={{ span: 2 }}
                >
                  {question.options.map((item, index) => {
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
                            index > 3 && (
                              <MinusCircleOutlined
                                onClick={() => {
                                  const newOptions = question.options
                                    .filter((option) => option.name !== item.name)
                                    .map((option, i) => {
                                      return {
                                        name: String.fromCharCode(i + 65),
                                        value: option.value,
                                      };
                                    });
                                  setQuestion({ ...question, options: newOptions });
                                }}
                              />
                            )
                          }
                        />
                      </Form.Item>
                    );
                  })}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        setQuestion({
                          ...question,
                          options: [
                            ...question.options,
                            {
                              name: String.fromCharCode(65 + question.options.length),
                              value: '',
                            },
                          ],
                        });
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
                {question.questionType === 0 && (
                  <Radio.Group
                    onChange={(e) => {
                      setQuestion({ ...question, answerIndex: [e.target.value] });
                    }}
                    defaultValue={question.answerIndex[0]}
                  >
                    {question.options.map((item, index) => (
                      <Radio key={item.value + item.name} value={index}>
                        {item.name}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
                {question.questionType === 1 && (
                  <Checkbox.Group
                    defaultValue={question.answerIndex}
                    onChange={(checkedValue) =>
                      setQuestion({ ...question, answerIndex: checkedValue })
                    }
                  >
                    {question.options.map((item, index) => (
                      <Checkbox key={item.value + item.name} value={index}>
                        {item.name}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
                {question.questionType === 3 && (
                  <Radio.Group
                    onChange={(e) => {
                      setQuestion({ ...question, answerValue: e.target.value });
                    }}
                    defaultValue={Number(question.answerValue)}
                  >
                    <Radio value={1}>??????</Radio>
                    <Radio value={0}>??????</Radio>
                  </Radio.Group>
                )}
                {question.questionType === 2 && [
                  <Form
                    form={answerForm}
                    key="fillAnswerForm"
                    preserve={false}
                    autoComplete="off"
                    labelCol={{ span: 2 }}
                    initialValues={answerInitialValue}
                  >
                    {question.answers.map((item, i) => {
                      return (
                        <Form.Item
                          key={`answer${i + 1}`}
                          label={`???${i + 1}?????????`}
                          name={`answer${i + 1}`}
                          rules={[{ required: true, message: `???${i + 1}????????????????????????` }]}
                        >
                          <Input
                            onClick={(e) => {
                              handleEditorModal(1, `answer${i + 1}`, e.target.value);
                            }}
                            addonAfter={
                              i !== 0 && (
                                <MinusCircleOutlined
                                  onClick={() => {
                                    const newAnswers = question.answers.filter(
                                      (answer) => answer.id !== item.id,
                                    );
                                    setQuestion({ ...question, answers: newAnswers });
                                  }}
                                />
                              )
                            }
                          />
                        </Form.Item>
                      );
                    })}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          setQuestion({
                            ...question,
                            answers: [
                              ...question.answers,
                              {
                                id: `answer${question.answers.length + 1}`,
                                value: '',
                              },
                            ],
                          });
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
                        <div>
                          1????????????????????????????????????????????????????????????????????????;????????????????????????H2O
                        </div>
                        <div>
                          2????????????????????????????????????????????????????????????????????????????????????????????????-?????????1-9,????????????1???9????????????????????????????????????1???9???
                        </div>
                      </div>
                    }
                    type="info"
                    showIcon
                  />,
                ]}
                {question.questionType === 4 && (
                  <div style={{ marginTop: 10 }}>
                    <Editor
                      initialValue={question.answerValue}
                      onEditorChange={(value, _) =>
                        setQuestion({ ...question, answerValue: value })
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
                    initialValues={{
                      answerAnalyze: question.answerAnalyze,
                    }}
                  >
                    <Form.Item
                      label="????????????"
                      name="answerAnalyze"
                      rules={[{ required: true, message: `???????????????????????????` }]}
                    >
                      <Input
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
                    defaultValue={question.difficulty}
                    onChange={(e) => {
                      setQuestion({ ...question, difficulty: e.target.value });
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
        )}
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
