import React, { useState } from "react";
import AuthPresenter from "./AuthPresenter";
import useInput from "../../Hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import {
  LOG_IN,
  CREATE_ACCOUNT,
  CONFIRM_SECRET,
  LOCAL_LOG_IN,
} from "./AuthQueries";
import { toast } from "react-toastify";

export default () => {
  const [action, setAction] = useState("logIn");
  const name = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
  const secret = useInput("");
  const email = useInput("");

  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: { email: email.value },
  });
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      email: email.value,
      name: name.value,
      firstName: firstName.value,
      lastName: lastName.value,
    },
  });

  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      email: email.value,
      secret: secret.value,
    },
  });

  const [localLoginMutation] = useMutation(LOCAL_LOG_IN);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (action === "logIn") {
      if (email.value !== "") {
        try {
          const {
            data: { requestSecret },
          } = await requestSecretMutation();
          if (!requestSecret) {
            toast.error("계정이 존재하지 않습니다. 계정을 생성해 주세요.");
            console.log(requestSecret);
            setTimeout(() => setAction("signUp"), 3000);
          } else {
            toast.success("이메일로 전송된 secret을 확인해주세요.");
            setAction("confirm");
          }
        } catch {
          toast.error("secret을 보낼 수 없습니다. 다시 시도해주세요.");
        }
      } else {
        toast.error("이메일을 입력해주세요.");
      }
    } else if (action === "signUp") {
      if (
        email.value !== "" &&
        name.value !== "" &&
        firstName.value !== "" &&
        lastName.value !== ""
      ) {
        try {
          const {
            data: { createAccount },
          } = await createAccountMutation();
          if (!createAccount) {
            toast.error("계정을 만들 수 없습니다.");
          } else {
            toast.success("계정이 생성되었습니다. 로그인해주세요.");
            setTimeout(() => setAction("logIn"), 3000);
          }
        } catch (e) {
          console.log(e);
          toast.error("계정을 생성할 수 없습니다. 다시 시도해주세요.");
        }
      } else {
        toast.error("모든 칸에 정보를 입력해주세요.");
      }
    } else if (action === "confirm") {
      if (secret.value !== "") {
        try {
          const {
            data: { confirmSecret: token },
          } = await confirmSecretMutation();
          if (token !== "" && token !== undefined) {
            localLoginMutation({ variables: { token } });
          } else {
            throw Error();
          }
        } catch {
          toast.error("secret을 확인할 수 없습니다. 다시 한번 확인해주세요.");
        }
      }
    }
  };

  return (
    <AuthPresenter
      setAction={setAction}
      action={action}
      name={name}
      firstName={firstName}
      lastName={lastName}
      email={email}
      secret={secret}
      onSubmit={onSubmit}
    />
  );
};
