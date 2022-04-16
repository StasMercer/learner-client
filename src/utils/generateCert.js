import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from 'moment';
import 'moment/locale/es-us';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function generatePdf(firstName, lastName, courseName, teacherName, right, wrong) {
    let docDefinition = {
        pageSize: 'A5',
        pageOrientation: 'landscape',
        content: [
            {image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADWUlEQVRoge3aSYgdRRzH8c/EGZc4MYFEFEUjCqIHD0IgigcNKgZFUMjBFTcYQSNRMbhgUBENKi644EFvCu4HQUFUJDiuSQyBGDUmGYyCOC4j6owLk5nnofoxL89JXnd11TyQ+cH/0q/q//9/q7urqv/1mFV2zcOn+BBzupxLtObhHTQKO6e76cTpdHxpCqKBl7uaUQXNxQq8a0+Apv2DQ7uWXQcdh6vxKsZMD9Bqq7qT5n91DK7Cc/hO58Tb7aMZz7hQ83F5Fjv3kWBZm8RRMwlwBl7AaILk2+3m3Mn34CJszpB8q72XE+I0YeHKCdA6e/WnBujF3ZiYIYimnZcS4nAMzjBA0x5JBXEYPu8SREOiafgIfJUxyd+xvkObv3FAHYg+YTRyjvaFRawNHdotqQPyUGaIr4Xt+sEY6dD28liI5cLKmhPkuiLWyhJt74uB6MO2zBDDwp2Yg+0l2r8UA1JmhOpac2d7Wcn2gzEgX2SG2CXMQn3YUbLPjqoQSzNDNHBlEWugQp9fqoLcnhlivfBeHILvK/QbqwrySkaI3Ti5iPNYRN9KWpcR5PEixkkYr9j3z6oguVbyncJ2fL/IGCPtiXYqfP1clbyEJoWiwyhuxKkRPoardlgr/d14tPB9vPCIxPh4syrI8sQQG02tGR/X8PNEVZBe/JAI4lccW/h9sKavm6qCwB0JICZxQeHvXPU3oMtiQOZiqGbgNYWvxfippq9R7B8DAmcKi1BM4OeFclG/NOWiN2IhmrolIuggDixAXksA0cD1dUHg3goBN2FB0e/+RBCjLT5ra0DnLcU2odoCNySCaODpVBBNnYItewm2Vai2EKrvqT6Rx3FiahDConYnfmsJ9gkWFr9fIn6CmM6ezAHRqvnC5/A6HF1cG5C2lDpsaoCyqVd4mSeE279G2orLBM7KDXEk3i8C/oVr8FRCiAZuyw2xAj8WwXaZqv4tFr+rbbe1OQGW2PP09XUsamtzbU2A3VidI/l+XIy3W4IN4fx99LlV3LvyDc6um/AVQg32LTwjHNR/JpwUNQON4C4cVMLfMuWPIEZwj0QnUg/sJci4cH43IJQ2q6hH+DfDw/hAOJoeEyaHIbyIS9UE6Jnm2gnCCroIf+BbYddauXIxq1n9D/Qvq/2G2/yLQVwAAAAASUVORK5CYII="},
            {
                text: 'This certificate confirms that '+firstName + ' ' + lastName + ' finished the course',
                style: 'header'
            },
            {
                text: courseName,
                style: 'header2',
                margin: [0, 20]
            },
            'With result: '+right+'/'+(right+wrong)+ '',
            'Date: '+ moment(new Date().toISOString()).format('LL'),
            'Teacher: ' + teacherName
        ],
        styles:{
            header:{fontSize: 16, bold: true},
            header2: {fontSize: 18, bold: true}
        }
    };
    pdfMake.createPdf(docDefinition).download();
}