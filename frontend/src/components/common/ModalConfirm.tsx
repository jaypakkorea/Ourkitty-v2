export default function ModalConfirm(props: any) {
  const { open, close, header } = props;

  return (
    <div className={open ? "openModal modal relative" : "modal relative"}>
      {open ? (
        <section className="w-[30%] h-[30%] flex flex-col justify-center">
          <header className="h-[50px] text-[1.5rem] dark:bg-DarkMain flex items-center">
            {header}
            <button className="close" onClick={close}>
              x
            </button>
          </header>
          <main className="flex-1 h-[3rem] dark:bg-DarkBackground2 overflow-y-auto overflow-x-hidden dark:text-white">
            {props.children}
          </main>
          <footer className="h-[70px] dark:bg-DarkBackground2 flex justify-end items-center">
            <button
              className="w-[80px] h-[50px] close bg-LightMain opacity-70 hover:opacity-100 dark:bg-DarkMain"
              onClick={close}
            >
              닫기
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
}
