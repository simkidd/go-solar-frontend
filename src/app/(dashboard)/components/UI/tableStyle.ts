export const customStyles = {
  rows: {
    style: {
      // minHeight: '40px', // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      fontWeight: "bold",
      // background: "#ffc77d",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
      // "&:not(:last-of-type)": {
      //   borderRightStyle: "solid",
      //   borderRightWidth: "1px",
      //   borderRightColor: defaultThemes.default.divider.default,
      // },
    },
  },
};